// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // initialize from localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // keep axios header in sync
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // login accepts both user object and the jwt token (token optional)
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || null);

    try {
      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      else localStorage.removeItem("user");
      if (jwtToken) localStorage.setItem("token", jwtToken);
      else localStorage.removeItem("token");
    } catch (err) {
      console.warn("AuthContext: localStorage failed", err);
    }

    if (jwtToken) axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {}
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
