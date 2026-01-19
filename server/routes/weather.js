const express = require('express');
const axios = require('axios');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

// GET /api/weather?city=London
router.get('/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        // Save to history
        await SearchHistory.create(weatherData);

        res.json(weatherData);
    } catch (error) {
        console.error(error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// GET /api/history
router.get('/history', async (req, res) => {
    try {
        const history = await SearchHistory.find().sort({ searchedAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;
