if (process.env.NODE_ENV !== "production") require("dotenv").config();

const connectDB = require('../config/db');
connectDB();

const io = require('socket.io-client');

const socket = io(process.env.URI);

socket.on('connect', () => {
    console.log('Scraper client connected');
});

socket.on('disconnect', () => {
    console.log('Scraper client disconnected');
});

socket.on('scraper-control', ({ site, updatedConfigDoc }) => {
    console.log(updatedConfigDoc, '---')

    if (updatedConfigDoc.control.action === 'start') {
        console.log("yes");

        const { scrape } = require(`./${site}`);
        console.log(`./${site}`)
        scrape(updatedConfigDoc);
    } else {
        console.log("no");
    }
});

socket.on('error', (error) => {
    console.error(`Error from socket: ${error}`);
});