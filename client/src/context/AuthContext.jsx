import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
        case 'REGISTER_FAIL':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        if (localStorage.token) {
            // In a real app we'd trigger a backend 'get user' route. 
            // For simplicity, we decode JWT.
            try {
                const decoded = jwtDecode(localStorage.token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    dispatch({ type: 'AUTH_ERROR' });
                } else {
                    dispatch({ type: 'USER_LOADED', payload: decoded.user });
                    // Note: decoded user only has ID usually. 
                    // Ideally we define GET /api/auth/user to get full profile.
                }
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    // Register
    const register = async formData => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            throw err.response.data.error || 'Registration failed';
        }
    };

    // Login
    const login = async formData => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            throw err.response.data.error || 'Login failed';
        }
    };

    // Logout
    const logout = () => dispatch({ type: 'LOGOUT' });

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
