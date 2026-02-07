import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [emoji, setEmoji] = useState('');  // Add emoji state
  const [tempUnit, setTempUnit] = useState('Cº'); // Add state for temperature unit
  const [city, setCity] = useState(''); // Add state for city input
  const [filteredCities, setFilteredCities] = useState([]);  // State for filtered cities

  // Fetch weather data for the default city (London) on component mount
  useEffect(() => {
    fetchWeather('London', 'metric');
  }, []);

  
  const fetchWeather = (cityName, unit) => {
    fetch(`http://localhost:3001/api/weather?q=${cityName}&units=${unit}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setWeather(data);
        updateEmoji(data.list[0].weather[0].description);  // Set emoji when data is fetched
        if (unit === 'metric') {
          setTempUnit('Cº');
        } else {
          setTempUnit('Fº');
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };

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

  // Handle input change and fetch filtered cities from the backend
  async function handleCityInputChange(e) {
    const input = e.target.value;
    setCity(input);

    // Fetch filtered cities based on the user's input
    if (input.trim() === '') {
      setFilteredCities([]);
    } else {
      fetch(`http://localhost:3001/api/citylist?search=${input}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setFilteredCities(data); // Update filtered cities based on the backend response
        })
        .catch(error => {
          console.error('Error fetching filtered cities:', error);
        });
    }
  };

  // Handle Enter key press to fetch weather data for the selected city
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && city.trim() !== '') {
      fetchWeather(city, tempUnit === 'Cº' ? 'metric' : 'imperial');
    }
  };

  return (
    <>
      <h1>Weather App</h1>
      <div className="Inputs">
        <label htmlFor="citySelect">Select a city:</label>
        <input
          id="citySelect"
          type="text"
          placeholder="Enter city name"
          value={city} // Bind the city input to the state
          onChange={handleCityInputChange} // Filter cities based on input
          onKeyDown={handleKeyDown} // Call the handleKeyDown function when Enter is pressed
          list="cities" // Bind the datalist to the input
        />
        <datalist id="cities">
          {filteredCities.map((city, index) => (
            <option key={index} value={city.trim()} />
          ))}
        </datalist>

        <div className='tempOps'>
          <label htmlFor="Celsius">Cº</label>
          <input type="radio" name="temp" id="celsius" value="metric" checked={tempUnit === 'Cº'} onChange={() => {
            fetchWeather(city, 'metric');
          }} />
          <label htmlFor="Fahrenheit">Fº</label>
          <input type="radio" name="temp" id="fahrenheit" value="imperial" checked={tempUnit === 'Fº'} onChange={() => {
            fetchWeather(city, 'imperial');
          }} />
        </div>

        <div className="card">
          {weather ? (
            <div className="weather-info">
              <h2>{weather.city.name}, {weather.city.country}</h2>
              {/* Loop through 3 days of forecast(add 8 each loop due to openweathermap's 3-hour interval data) */}
              <div className='weather-container'>
                <div className='weather-box'>
                  <h3>Current Weather</h3>
                  <p>{emoji} {weather.list[0].weather[0].description}</p>
                  <p>Temperature: {weather.list[0].main.temp} {tempUnit}</p>
                </div>
                <div className='weather-box'>
                  <h3>Next 24 Hours</h3>
                  <p>{emoji} {weather.list[8].weather[0].description}</p>
                  <p>Temperature: {weather.list[8].main.temp} {tempUnit}</p>
                </div>
                <div className='weather-box'>
                  <h3>Next 48 Hours</h3>
                  <p>{emoji} {weather.list[16].weather[0].description}</p>
                  <p>Temperature: {weather.list[16].main.temp} {tempUnit}</p>
                </div>
              </div>
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
