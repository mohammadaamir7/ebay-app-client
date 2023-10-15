const mongoose = require('mongoose');

const ScraperConfig = require('./models/ScraperConfig');

const data = [
    {
        site: "volutone",
        config: {
            brand: "",
            itemPerPage: 96,
            login: {
                user: "GLC",
                pass: "Volutone"
            },
            delay: {
                delayOn: "item",
                delayTime: 10
            },
            interception: false,
            status: {
                text: 'Idle',
                pages: 0,
                items: 0
            },
            control: {
                action: 'stop',
                type: '',
                paused: false,
                instance: false
            },
            checkpoint: {
                brand: '',
                page: '',
            },
        }
    },
    {
        site: "adiglobal",
        config: {
            brand: "",
            itemPerPage: 36,
            login: {
                user: "adam@patagol.com",
                pass: "Patagol123"
            },
            delay: {
                delayOn: "item",
                delayTime: 10
            },
            interception: false,
            status: {
                text: 'Idle',
                pages: 0,
                items: 0
            },
            control: {
                action: 'stop',
                type: '',
                paused: false,
                instance: false
            },
            checkpoint: {
                brand: '',
                page: '',
            },
            localStorage: [
                "DefaultPagination-ProductList",
                {
                    "currentPage": 1,
                    "page": 1,
                    "pageSize": 36,
                    "defaultPageSize": 36,
                    "pageSizeOptions": [12, 24, 36, 48],
                    "sortOptions": [{ "displayName": "Best Sellers", "sortType": "Bestseller" },
                    { "displayName": "Best Match", "sortType": "1" }, { "displayName": "Product: A to Z", "sortType": "2" },
                    { "displayName": "Product: Z to A", "sortType": "3" }],
                    "sortType": "Bestseller",
                    "nextPageUri": null,
                    "prevPageUri": null,
                    "hasMarketTile": false
                }
            ]
        }
    }
]

const main = async () => {
    try {
        await mongoose.connect('mongodb+srv://root:3kwfteJDv2NKJueh@cluster0.pz5kkjn.mongodb.net/test?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    await ScraperConfig.insertMany(data);
}

main();