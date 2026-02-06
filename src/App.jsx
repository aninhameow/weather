import { use, useState, useEffect } from 'react'
import './App.css'

function App() {
  const [weather, setWeather] = useState(null)

useEffect(() => {
  fetch('http://localhost:3001/api/weather')  // Explicitly set the full URL for debugging
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => setWeather(data))
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}, []);


  return (
    <>
      <h1>Weather App</h1>

      <div className="card">
          {weather ? (
            <div>
              <h2>{weather.name}</h2>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        <p>
        </p>
      </div>
    </>
  )
}

export default App
