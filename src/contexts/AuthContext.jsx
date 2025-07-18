import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api.js';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  changePassword: async () => { return { success: false }; },
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'x-auth-token': token
            }
          });
          
          if (!response.ok) {
            throw new Error('Token invalid');
          }
          
          const userData = await response.json();
          
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  // Login user
  const login = async (email, password) => {
    try {
      // Using axios directly with the API configuration from api.js
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      // Set auth header for future axios requests
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
    } catch (err) {
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage and state
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove auth header
    delete axios.defaults.headers.common['x-auth-token'];
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
