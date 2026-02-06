import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/weather')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setWeather(data);
        updateEmoji(data.weather[0].description);  // Set emoji when data is fetched
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, []);

  return (
    <>
      <h1>Weather App</h1>
      <label htmlFor="citySelect">Select a city:</label>
      {/* Input instead of select since openweathermap has too many cities to add them all to the select options */}
      <input
        id="citySelect"
        type="text"
        placeholder="Enter city name"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const selectedTemp = document.querySelector('input[name="temp"]:checked').value;
            fetch(`http://localhost:3001/api/weather?city=${e.target.value}&units=${selectedTemp}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                setWeather(data);
                updateEmoji(data.weather[0].description);  // Update emoji when city changes
              })
              .then(() => e.target.value = '') // Clear the input after fetching
              .catch(error => {
                console.error('Error fetching weather data:', error);
              });
          }
        }}
      />
      <div className="card">
        {weather ? (
          <div>
            <h2>{weather.name}</h2>
            <p>Temperature: {weather.main.temp} </p>
            <p>Weather: {weather.weather[0].description} {emoji}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </>
  );
}

export default App;