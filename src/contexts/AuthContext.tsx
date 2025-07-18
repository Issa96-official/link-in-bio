import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{success: boolean}>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  changePassword: async () => { return { success: false }; },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
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
  const login = async (email: string, password: string) => {
    try {
      // Using axios directly with the API configuration from api.ts
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
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err: any) {
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
