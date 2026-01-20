const AirQualityCard = ({ aqi }) => {
    const getAQILabel = (index) => {
        const labels = {
            1: { text: "Good", color: "text-green-600", bg: "bg-green-100" },
            2: { text: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" },
            3: { text: "Moderate", color: "text-orange-600", bg: "bg-orange-100" },
            4: { text: "Poor", color: "text-red-600", bg: "bg-red-100" },
            5: { text: "Very Poor", color: "text-purple-600", bg: "bg-purple-100" }
        };
        return labels[index] || labels[3];
    };

    const { text, color, bg } = getAQILabel(aqi);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md w-full border border-gray-100 flex flex-col items-center">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">AIR QUALITY</h3>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${bg} ${color}`}>
                {text}
            </div>
            <p className="text-gray-400 text-xs mt-2">Index: {aqi}</p>
        </div>
    );
};

export default AirQualityCard;
