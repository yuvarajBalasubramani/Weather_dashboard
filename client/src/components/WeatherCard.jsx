const WeatherCard = ({ weather }) => {
    if (!weather) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto text-center transform transition-all hover:scale-105 duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{weather.city}</h2>
            <div className="flex justify-center items-center my-4">
                <img
                    src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.condition}
                    className="w-24 h-24 drop-shadow-md"
                />
                <div className="text-6xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</div>
            </div>
            <p className="text-xl text-gray-600 capitalize mb-4 font-medium">{weather.condition}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Humidity</p>
                    <p className="text-xl font-semibold text-blue-800">{weather.humidity}%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Wind Speed</p>
                    <p className="text-xl font-semibold text-blue-800">{weather.windSpeed} m/s</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
