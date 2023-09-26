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
  brand: "volutone",
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
    action: "stop",
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

// scrape(config)
// synchronizeData("ebaystore@test.com", "volutone")
// getStore()

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
