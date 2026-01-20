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

    // 1. Fetch Current Weather to get coords
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherRes = await axios.get(weatherUrl);
    const weatherData = weatherRes.data;

    const { lat, lon } = weatherData.coord;

    // 2. Parallel Fetch for Air Quality and Forecast
    const [aqiRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    ]);

    const result = {
      city: weatherData.name,
      coord: { lat, lon }, // Added for Map
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      aqi: aqiRes.data.list[0].main.aqi, // 1=Good, 5=Poor
      forecast: forecastRes.data.list.filter((item, index) => index % 8 === 0).slice(0, 5) // Simple daily approximation (every 24h)
    };

    // Save to history (only basic info to keep schema simple for now)
    await SearchHistory.create({
      city: result.city,
      temperature: result.temperature,
      condition: result.condition,
      icon: result.icon,
      humidity: result.humidity,
      windSpeed: result.windSpeed
    });

    res.json(result);
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
