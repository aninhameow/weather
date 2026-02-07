const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const cities = fs.readFileSync('./citylist.txt', 'utf-8').split('\n');
const API_KEY = process.env.API_KEY;

const app = express();
const PORT = 3001;

app.use(cors());

// Endpoint to get the filtered city list based on search query
app.get('/api/citylist', (req, res) => {
    const search = req.query.search || '';  // Search query from the client
    const filteredCities = cities.filter(city => city.toLowerCase().startsWith(search.toLowerCase()));
    const limitedCities = filteredCities.slice(0, 2000);  // Limit to the first 200 results
    res.json(limitedCities);  // Send the filtered list back to the client
});

// Weather data fetching endpoint
app.get('/api/weather', async (req, res) => {
  const city = req.query.q || 'London';
  const units = req.query.units || 'metric';

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=${API_KEY}&units=${units}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
