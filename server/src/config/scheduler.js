const Cron = require("node-cron");
const Item = require("../models/Item");
const ScraperConfig = require("../models/ScraperConfig");
const { synchronizeData } = require("../helpers/synchronize");

exports.scheduleJob = async (io) => {
  Cron.schedule("* */3 * * *", async () => {
    console.log("Cron job running");
    const sites = ["volutone"];
    for (let index = 0; index < sites.length; index++) {
      const site = sites[index];
      const siteData = await ScraperConfig.find({ site });
      const { scrape } = require(`../scrapers/${site}`);

      await scrape(siteData[0].config);
      await synchronizeData();
      // const items = await Item.find({ site });
      // io.emit("sync-listings", items);
    }
  }).start();
};
