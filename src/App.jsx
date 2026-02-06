import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [emoji, setEmoji] = useState('');  // Add emoji state
  const [tempUnit, setTempUnit] = useState('Cº'); // Add state for temperature unit

  useEffect(() => {
    // Default to fetching weather for London when the app loads
    fetch(`http://localhost:3001/api/weather?units=metric`)
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

  const updateEmoji = (description) => {
    let emoji = '';
    switch (description) {
      case 'clear sky':
        emoji = '☀️';
        break;
      case 'few clouds':
        emoji = '🌤️';
        break;
      case 'overcast clouds':
        emoji = '☁️';
        break;
      case 'scattered clouds':
        emoji = '☁️';
        break;
      case 'broken clouds':
        emoji = '⛅';
        break;
      case 'shower rain':
        emoji = '🌦️';
        break;
      case 'rain':
        emoji = '🌧️';
        break;
      case 'thunderstorm':
        emoji = '⛈️';
        break;
      case 'snow':
        emoji = '❄️';
        break;
      case 'mist':
        emoji = '🌫️';
        break;
      default:
        emoji = '';  // Default to no emoji if description doesn't match
        break;
    }
    setEmoji(emoji);  // Update the emoji state
  };
  

  return (
    <>
      <h1>Weather App</h1>
      <label htmlFor="citySelect">Select a city:</label>
      {/* Input instead of select since openweathermap has too many cities to add them all to the select options */}
      <div className='Inputs'>
      <input
        id="citySelect"
        type="text"
        placeholder="Enter city name"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const selectedTemp = document.querySelector('input[name="temp"]:checked').value;
            fetch(`http://localhost:3001/api/weather?q=${e.target.value}&units=${selectedTemp}`)
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
      <div className='tempOps'>
      <label htmlFor="Celsius">Cº</label>
      <input type="radio" name="temp" id="celsius" value="metric" defaultChecked onChange={(e) => {
        console.log(weather.name);
        fetch(`http://localhost:3001/api/weather?q=${weather.name}&units=${e.target.value}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setWeather(data);
          updateEmoji(data.weather[0].description);  // Update emoji when unit changes
        })
        .then(() => setTempUnit("Cº")) // Update temperature unit after fetching so that it doesn't change before the data is fetched
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
      }} />
      <label htmlFor="Fahrenheit">Fº</label>
      <input type="radio" name="temp" id="fahrenheit" value="imperial" onChange={(e) => {
        fetch(`http://localhost:3001/api/weather?q=${weather.name}&units=${e.target.value}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setWeather(data);
            updateEmoji(data.weather[0].description);  // Update emoji when unit changes
          })
          .then(() => setTempUnit("Fº"))
          .catch(error => {
            console.error('Error fetching weather data:', error);
          });
      }} />
      </div>
      <div className="card">
        {weather ? (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p>Temperature: {weather.main.temp} {tempUnit}</p>
            <p>Weather: {weather.weather[0].description} {emoji}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
      </div>
    </>
  );
}

export default App;