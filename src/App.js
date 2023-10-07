import React, { useState, useEffect } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const defaultCity = "Bhopal"; // Default city is set to "Bhopal"

  useEffect(() => {
    // Fetch weather data for the default city when the component mounts
    const fetchData = async () => {
      try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(
          `${WEATHER_API_URL}/weather?q=${defaultCity}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!currentWeatherResponse.ok) {
          throw new Error(`HTTP error! Status: ${currentWeatherResponse.status}`);
        }

        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch forecast data for the default city
        const forecastResponse = await fetch(
          `${WEATHER_API_URL}/forecast?q=${defaultCity}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
          throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        // Set both current weather and forecast data
        setCurrentWeather({ city: defaultCity, ...currentWeatherData });
        setForecast({ city: defaultCity, ...forecastData });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [defaultCity]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(console.log);
  };
  return (
    <div className="container">
      <img
        alt="weather"
        className="background-image"
        src={`icons/${currentWeather.weather[0].icon}.jpg`}
      />
      <Search onSearchChange={handleOnSearchChange} defaultCity={defaultCity} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
