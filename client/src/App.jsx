import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HistoryList from './components/HistoryList';
import AirQualityCard from './components/AirQualityCard';
import ForecastCard from './components/ForecastCard';
import MapCard from './components/MapCard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { getWeather, getHistory } from './services/api';
import './index.css';

// Dashboard component (The original App content)
const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);

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
      await fetchHistory();
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Navbar /> {/* We might need to update Navbar to show user info/logout */}

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
            <div className="lg:col-span-3 flex flex-col gap-6">
              <WeatherCard weather={weatherData} />
              <AirQualityCard aqi={weatherData.aqi} />
            </div>
            <div className="lg:col-span-6 h-[400px] lg:h-auto min-h-[400px]">
              <MapCard lat={weatherData.coord?.lat} lon={weatherData.coord?.lon} city={weatherData.city} />
            </div>
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-full overflow-y-auto max-h-[500px]">
                <HistoryList history={history} onSelect={handleSearch} />
              </div>
            </div>
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
};

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
