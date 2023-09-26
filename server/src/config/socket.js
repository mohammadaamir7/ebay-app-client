const { Server } = require("socket.io");
const mongoose = require('mongoose');
const { synchronizeData } = require("../helpers/synchronize");
const Item = require("../models/Item");
const ScraperConfig = require("../models/ScraperConfig");
const Store = require("../models/Store");

async function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("Server client connected");

        socket.on("sync-listings", async (data) => {
          try {
            console.log("sync-listings : ", data);

            const { site, store } = data;
            const siteData = await ScraperConfig.find({ site });
            const storeData = await Store.findOne({ email: store });
            const { scrape } = require(`../scrapers/${site}`);
            // const store = "ebaystore@test.com"
            
            await scrape(siteData[0].config)
            await synchronizeData(store, site, storeData?.oAuthToken);
            const items = await Item.find({ site });
            io.emit("sync-listings", items);

          } catch (err) {
            console.log(err);
          }
        });

        socket.on("disconnect", () => {
            console.log("Server client disconnected");
        });
    });

    const db = mongoose.connection;
    const collection = db.collection('scraper_configs');
    const changeStream = await collection.watch();

    changeStream.on('change', async (change) => {
        if (change.operationType === 'update') {
            const documentId = change.documentKey._id;
            const updatedConfigDoc = await collection.findOne({ _id: documentId });

            io.emit('config-updated', { site: updatedConfigDoc.site, updatedConfigDoc: updatedConfigDoc.config });
            
            if (!updatedConfigDoc.config.control.instance) {
                io.emit('scraper-control', { site: updatedConfigDoc.site, updatedConfigDoc: updatedConfigDoc.config });
            }
        }
    });

    return io;
}

module.exports = setupSocket;