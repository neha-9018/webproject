import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create axios instance with interceptors
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Add request interceptor to include token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify token is not expired
        const tokenData = parseJwt(token);
        if (tokenData && tokenData.exp * 1000 > Date.now()) {
          setUser(userData);
        } else {
          // Token expired, clean up
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error parsing JWT:', err);
      return null;
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔐 Attempting login for:', username);
      
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password
      });

      const { token, username: returnedUsername, role } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      localStorage.setItem('token', token);
      const userData = {
        username: returnedUsername || username,
        role: role || 'USER',
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('✅ Login successful:', userData);
      return { success: true };
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('📝 Attempting registration for:', { username, email });
      
      // Validate username (no spaces)
      if (username.includes(' ')) {
        throw new Error('Username cannot contain spaces. Use underscores instead.');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('Password must contain uppercase, lowercase, and numbers');
      }

      const response = await api.post('/auth/register', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });

      const { token, username: returnedUsername, role } = response.data;

      // Auto-login after registration if token is provided
      if (token) {
        localStorage.setItem('token', token);
        const userData = {
          username: returnedUsername || username,
          role: role || 'USER',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        console.log('✅ Registration and auto-login successful:', userData);
      } else {
        console.log('✅ Registration successful (no auto-login)');
      }

      return { success: true };
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    console.log('👋 Logging out user:', user?.username);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }, [navigate, user]);

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

  // Authenticated API call using axios
  const authenticatedRequest = async (method, url, data = null) => {
    try {
      const config = {
        method,
        url,
        data,
      };
      
      const response = await api(config);
      return response.data;
    } catch (err) {
      console.error(`API Error (${method} ${url}):`, err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
    api, // Export configured axios instance
    authenticatedRequest,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};