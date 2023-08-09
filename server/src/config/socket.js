const { Server } = require("socket.io");
const mongoose = require('mongoose');

async function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("Server client connected");

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