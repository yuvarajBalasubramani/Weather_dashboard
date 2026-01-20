const axios = require('axios');
const SearchHistory = require('../models/SearchHistory');

exports.getWeather = async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // 1. Fetch Current Weather
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
            coord: { lat, lon },
            temperature: weatherData.main.temp,
            condition: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            aqi: aqiRes.data.list[0].main.aqi,
            forecast: forecastRes.data.list.filter((item, index) => index % 8 === 0).slice(0, 5)
        };

        // Save to history if user is authenticated
        if (req.user) {
            await SearchHistory.create({
                user: req.user.id,
                city: result.city,
                temperature: result.temperature,
                condition: result.condition,
                icon: result.icon,
                humidity: result.humidity,
                windSpeed: result.windSpeed
            });
        }

        res.json(result);
    } catch (error) {
        console.error(error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        // Only fetch history for the logged-in user
        const history = await SearchHistory.find({ user: req.user.id })
            .sort({ searchedAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
