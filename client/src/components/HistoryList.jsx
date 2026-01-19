const HistoryList = ({ history, onSelect }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="mt-8 w-full max-w-md animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 ml-1">Recent Searches</h3>
            <div className="flex flex-col gap-2">
                {history.map((item, index) => (
                    <button
                        key={item._id || index}
                        onClick={() => onSelect(item.city)}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-left group shadow-sm"
                    >
                        <span className="font-medium text-gray-800 group-hover:text-blue-700">{item.city}</span>
                        <span className="text-xs text-gray-400 group-hover:text-blue-500">
                            {new Date(item.searchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
