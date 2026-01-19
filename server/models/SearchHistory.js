const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: Number,
    condition: String,
    icon: String,
    humidity: Number,
    windSpeed: Number,
    searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
