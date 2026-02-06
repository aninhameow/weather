const axios = require('axios')
const express = require('express')
const cors = require('cors');
require('dotenv').config()



const API_KEY = process.env.API_KEY

const app = express()
const PORT = 3001

app.use(cors());

app.get('/api/weather', async (req, res) => {
    // Get the city from query parameters, default to 'London' if not provided
    const city = req.query.city || 'London'

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching weather data:', error)
        res.status(500).json({ error: 'Failed to fetch weather data' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

