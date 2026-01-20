import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 fixed top-0 left-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
                    WeatherDash
                </h1>
                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:block text-gray-600 font-medium">Hello, {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-red-600 transition-colors font-medium border border-gray-200 px-4 py-1 rounded-full hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">Guest</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
