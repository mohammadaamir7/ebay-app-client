const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScraperConfigSchema = new Schema({
    site: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    brands: { type: Array },
    updatedDate: { type: Date, default: Date.now },
});

const ScraperConfig = mongoose.model('ScraperConfig', ScraperConfigSchema, 'scraper_configs');

module.exports = ScraperConfig; 