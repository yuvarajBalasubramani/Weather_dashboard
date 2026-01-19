import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HistoryList from './components/HistoryList';
import { getWeather, getHistory } from './services/api';
import './index.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setWeather(data);
      await fetchHistory();
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 tracking-tight drop-shadow-sm">
        Weather Dashboard
      </h1>

      <div className="w-full max-w-md">
        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-xl border border-red-200 mb-6 animate-pulse">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="mt-6 mb-8">
            <WeatherCard weather={weather} />
          </div>
        )}

        <HistoryList history={history} onSelect={handleSearch} />
      </div>
    </div>
  );
}

export default App;
