import { useState, useEffect } from 'react';
import './App.css';


const updateEmoji = (description) => {
    let emoji = '';
    switch (description) {
      case 'clear sky':
        emoji = '☀️';
        break;
      case 'overcast clouds':
        emoji = '☁️';
        break;
      case 'scattered clouds':
        emoji = '🌥️';
        break;
      case 'broken clouds':
        emoji = '⛅';
        break;
      case 'few clouds':
        emoji = '🌤️';
        break;
      case 'shower rain':
        emoji = '🌦️';
        break;
      case 'rain':
        emoji = '🌧️';
        break;
      case 'light rain':
        emoji = '🌦️';
        break;
      case 'moderate rain':
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
        emoji = null;  // Default to no emoji if description doesn't match
        break;
    }
    return emoji;
  };

function App() {
  const [weather, setWeather] = useState(null);
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
                {weatherBox(0, weather, tempUnit)}
                {weatherBox(8, weather, tempUnit)}
                {weatherBox(16, weather, tempUnit)}
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


export function weatherBox(index, weather, tempUnit) {
  const description = weather.list[index].weather[0].description;
  const temperature = weather.list[index].main.temp;
  const emoji = updateEmoji(description);

  return (
    <div className="weather-box">
      <h3>Weather Forecast</h3>
      <p className='emoji'>{emoji}</p>  <p>{description}</p>
      <p>Temperature: {temperature} {tempUnit}</p>
    </div>
  );
}