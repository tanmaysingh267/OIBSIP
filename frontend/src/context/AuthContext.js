import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setUser(null);
        setAdmin(null);
        setAuthInitializing(false);
        return;
      }

      if (user || admin) {
        setAuthInitializing(false);
        return;
      }

      setAuthInitializing(true);

      try {
        const response = await apiClient.get('/users/profile');
        setUser(response.data);
        setAdmin(null);
      } catch (userError) {
        try {
          const response = await apiClient.get('/admin/profile');
          setAdmin(response.data);
          setUser(null);
        } catch (adminError) {
          setToken(null);
          setUser(null);
          setAdmin(null);
        }
      } finally {
        setAuthInitializing(false);
      }
    };

    restoreSession();
  }, [token, user, admin]);

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/login', credentials);
      setToken(response.data.token);
      setUser(response.data.user);
      setAdmin(null);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/admin/login', credentials);
      setToken(response.data.token);
      setAdmin(response.data.admin);
      setUser(null);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Admin login failed' };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error processing request' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        loading,
        authInitializing,
        registerUser,
        verifyEmail,
        loginUser,
        adminLogin,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
