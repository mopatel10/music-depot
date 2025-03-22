'use client';  
import React, { createContext, useContext, useState, useEffect } from "react";

// Define authentication context
const AuthContext = createContext<{ isLoggedIn: boolean; setIsLoggedIn: (value: boolean) => void }>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

// Provide authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isLoggedIn");
    if (storedAuth === "true") {
      setIsLoggedInState(true);
    }
  }, []);

  // Update localStorage whenever authentication state changes
  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value);
    localStorage.setItem("isLoggedIn", value.toString());
  };

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);
