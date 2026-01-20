const Navbar = () => {
    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 fixed top-0 left-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    WeatherDash
                </h1>
                <div className="flex gap-4">
                    <a href="#" className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</a>
                    <a href="#" className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors font-medium">Map</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
