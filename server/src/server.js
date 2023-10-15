if (process.env.NODE_ENV !== "production") require("dotenv").config();

const connectDB = require("./config/db");
const setupSocket = require("./config/socket");
const API_PREFIX = process.env.API_PREFIX;

const express = require("express");
const app = express();
const morgan = require("morgan");

const cors = require("cors");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http");
const server = http.createServer(app);

const accountRouter = require("./modules/account/account.routes");
const scrapeRouter = require("./modules/scrape/scrape.routes");
const siteRouter = require("./modules/site/site.routes");
const { scrape } = require("./scrapers/volutone");
const { scheduleJob } = require("./config/scheduler");
const { synchronizeData } = require("./helpers/synchronize");
const { getStore } = require("./helpers/ebayHelper");


connectDB();

app.use(express.static("public"));

app.use(API_PREFIX + "/account", accountRouter);
app.use(API_PREFIX + "/scrape", scrapeRouter);
app.use(API_PREFIX + "/sites", siteRouter);

const io = setupSocket(server);
const config = {
  brand: "Araknis Networks",
  site: "volutone",
  itemPerPage: 96,
  login: {
    user: "GLC",
    pass: "Volutone",
  },
  delay: {
    delayOn: "item",
    delayTime: 10,
  },
  interception: false,
  status: {
    text: "Idle",
    pages: 0,
    items: 0,
  },
  control: {
    action: "start",
    type: "",
    paused: false,
    instance: false,
  },
  checkpoint: {
    brand: "Araknis Networks",
    page: "1",
  },
};

// scheduleJob()
const token = "v^1.1#i^1#p^3#f^0#r^0#I^3#t^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"

// scrape(config)
// synchronizeData("ebaystore@test.com", "volutone", token)
// getStore()

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
