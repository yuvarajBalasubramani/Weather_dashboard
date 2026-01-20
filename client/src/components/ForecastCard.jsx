const ForecastCard = ({ forecast }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                            {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
                        </p>
                        <img
                            src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                            alt={day.weather[0].description}
                            className="w-10 h-10"
                        />
                        <p className="text-lg font-bold text-gray-800">{Math.round(day.main.temp)}°</p>
                        <p className="text-xs text-gray-400 capitalize">{day.weather[0].main}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastCard;
