if (process.env.NODE_ENV !== "production") require("dotenv").config();

const connectDB = require('./config/db');
const setupSocket = require('./config/socket');

const API_PREFIX = process.env.API_PREFIX;

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http");
const server = http.createServer(app);

const accountRouter = require('./modules/account/account.routes');
const scrapeRouter = require('./modules/scrape/scrape.routes');
const siteRouter = require('./modules/site/site.routes');

connectDB();

app.use(express.static('public'));

app.use(API_PREFIX + '/account', accountRouter);
app.use(API_PREFIX + '/scrape', scrapeRouter);
app.use(API_PREFIX + '/sites', siteRouter);

const io = setupSocket(server);

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});