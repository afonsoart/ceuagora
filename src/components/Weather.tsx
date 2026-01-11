"use client";

import { useState, useEffect } from "react";
import { WeatherData } from "@/types/Weather";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

  const fetchWeather = async () => {
    if (!city) {
      setError(getTranslation("enterCity"));
      return;
    }
    if (!WEATHER_API_KEY) {
      setError("Weather API key is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherResponse.ok) {
        setWeather(weatherData);
        setCity(weatherData.name); // Atualiza o campo com o nome correto da cidade
        fetchBackground(weatherData.name);
      } else {
        setError(weatherData.message);
      }
    } catch (error) {
      setError("An error occurred while fetching the weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    if (!WEATHER_API_KEY) {
      setError("Weather API key is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherResponse.ok) {
        setWeather(weatherData);
        setCity(weatherData.name); // Define o nome da cidade no input
        fetchBackground(weatherData.name);
      } else {
        setError(weatherData.message);
      }
    } catch (error) {
      setError("An error occurred while fetching the weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBackground = async (query: string) => {
    if (!UNSPLASH_API_KEY) {
      console.error("Unsplash API key is not configured.");
      return;
    }
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&client_id=${UNSPLASH_API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        setBackground(data.urls.full);
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  useEffect(() => {
    if (background) {
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, [background]);

  useEffect(() => {
    // Buscar localização do usuário ao carregar o componente
    const getUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Se o usuário negar, não fazer nada
          }
        );
      }
    };

    getUserLocation();
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const translateWeather = (description: string): string => {
    if (language === "en") return description;
    
    const translations: { [key: string]: string } = {
      "clear sky": "céu limpo",
      "few clouds": "poucas nuvens",
      "scattered clouds": "nuvens dispersas",
      "broken clouds": "nuvens quebradas",
      "overcast clouds": "nublado",
      "shower rain": "chuva rápida",
      "rain": "chuva",
      "light rain": "chuva leve",
      "moderate rain": "chuva moderada",
      "heavy intensity rain": "chuva forte",
      "thunderstorm": "tempestade",
      "snow": "neve",
      "mist": "névoa",
      "smoke": "fumaça",
      "haze": "neblina",
      "dust": "poeira",
      "fog": "nevoeiro",
      "sand": "areia",
      "ash": "cinzas",
      "squall": "rajada",
      "tornado": "tornado",
    };
    
    return translations[description.toLowerCase()] || description;
  };

  const getTranslation = (key: string): string => {
    const translations: { [key: string]: { pt: string; en: string } } = {
      title: { pt: "Céu Agora", en: "Sky Now" },
      placeholder: { pt: "Buscar por uma cidade...", en: "Search for a city..." },
      search: { pt: "Buscar", en: "Search" },
      enterCity: { pt: "Por favor, digite uma cidade", en: "Please enter a city" },
      maxTemp: { pt: "Máxima", en: "Max" },
      minTemp: { pt: "Mínima", en: "Min" },
      humidity: { pt: "Umidade", en: "Humidity" },
      pressure: { pt: "Pressão", en: "Pressure" },
      wind: { pt: "Vento", en: "Wind" },
      visibility: { pt: "Visibilidade", en: "Visibility" },
      clouds: { pt: "Nuvens", en: "Clouds" },
      sunrise: { pt: "Nascer do Sol", en: "Sunrise" },
      sunset: { pt: "Pôr do Sol", en: "Sunset" },
      feelsLike: { pt: "Sensação térmica", en: "Feels like" },
      coordinates: { pt: "Coordenadas", en: "Coordinates" },
      updated: { pt: "Atualizado", en: "Updated" },
      direction: { pt: "Direção", en: "Direction" },
    };
    
    
    return translations[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-500 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-2xl">
        {/* Language Toggle */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setLanguage("pt")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              language === "pt"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title="Português"
          >
            <span className="text-xl">🇧🇷</span>
            <span className="font-medium">PT</span>
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              language === "en"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title="English"
          >
            <span className="text-xl">🇺🇸</span>
            <span className="font-medium">EN</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900">
          {getTranslation("title")}
        </h1>
        <div className="relative">
          <input
            type="text"
            name="city"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
            className="block w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={getTranslation("placeholder")}
          />
          <button
            type="submit"
            onClick={fetchWeather}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 rounded-r-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? "..." : getTranslation("search")}
          </button>
        </div>
        {error && <p className="text-sm text-center text-red-600">{error}</p>}
        {weather && (
          <div className="mt-8 space-y-6">
            {/* Informações Principais */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="mt-2 text-2xl text-gray-700 capitalize">
                {translateWeather(weather.weather[0].description)}
              </p>
              <p className="mt-4 text-6xl font-extrabold text-gray-900">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="mt-2 text-lg text-gray-600">
                {getTranslation("feelsLike")}: {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            {/* Grid de Informações Detalhadas */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Temperatura Máxima e Mínima */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">{getTranslation("maxTemp")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(weather.main.temp_max)}°C
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">{getTranslation("minTemp")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(weather.main.temp_min)}°C
                </p>
              </div>

              {/* Umidade */}
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">{getTranslation("humidity")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weather.main.humidity}%
                </p>
              </div>


              {/* Vento */}
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">{getTranslation("wind")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weather.wind.speed} m/s
                </p>
                {weather.wind.deg !== undefined && (
                  <p className="text-xs text-gray-600">
                    {getTranslation("direction")}: {weather.wind.deg}°
                  </p>
                )}
              </div>

              {/* Visibilidade */}
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">
                  {getTranslation("visibility")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {weather.visibility ? (weather.visibility / 1000).toFixed(1) : "N/A"} km
                </p>
              </div>

              {/* Nuvens */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">{getTranslation("clouds")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weather.clouds.all}%
                </p>
              </div>

            </div>

            {/* Informações Adicionais */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {getTranslation("coordinates")}: {weather.coord.lat.toFixed(2)}°,{" "}
                  {weather.coord.lon.toFixed(2)}°
                </span>
                <span>{getTranslation("updated")}: {new Date().toLocaleTimeString(language === "pt" ? "pt-BR" : "en-US")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;