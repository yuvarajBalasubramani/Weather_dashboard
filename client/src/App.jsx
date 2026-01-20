import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HistoryList from './components/HistoryList';
import AirQualityCard from './components/AirQualityCard';
import ForecastCard from './components/ForecastCard';
import MapCard from './components/MapCard';
import { getWeather, getHistory } from './services/api';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Coords for map (default to London)
  const [coords, setCoords] = useState({ lat: 51.505, lon: -0.09 });

  const fetchHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(city);
      setWeatherData(data);
      if (data.coord) { // Ensure API returns coord (we need to modify backend if not, but currently it returns weatherData which is custom object... wait, we need to add coord to backend response)
        // Our backend currently returns custom object. Let's fix that in backend or here. 
        // Oh wait, my backend response 'result' does NOT include lat/lon directly, but it uses them to fetch other data.
        // currently I don't pass lat/lon to frontend. I need to update backend to pass lat/lon.
      }
      await fetchHistory();
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect to update map coords when weatherData updates
  useEffect(() => {
    if (weatherData && weatherData.coord) {
      setCoords(weatherData.coord);
    }
  }, [weatherData]);


  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Navbar />

      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {weatherData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">

            {/* Left Column: Current Weather & Details (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <WeatherCard weather={weatherData} />
              <AirQualityCard aqi={weatherData.aqi} />
            </div>

            {/* Middle Column: Map (6 cols) - Dominant Visual */}
            <div className="lg:col-span-6 h-[400px] lg:h-auto min-h-[400px]">
              <MapCard lat={weatherData.coord?.lat} lon={weatherData.coord?.lon} city={weatherData.city} />
            </div>

            {/* Right Column: History & Misc (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-full overflow-y-auto max-h-[500px]">
                <HistoryList history={history} onSelect={handleSearch} />
              </div>
            </div>

            {/* Bottom Row: Forecast (Full Width) */}
            <div className="lg:col-span-12">
              <ForecastCard forecast={weatherData.forecast} />
            </div>
          </div>
        )}

        {!weatherData && !loading && !error && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Search for a city to explore the weather dashboard.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
