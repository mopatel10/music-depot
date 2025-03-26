'use client';  
import React, { createContext, useContext, useState, useEffect } from "react";
import jwt from 'jsonwebtoken';

// Define the shape of the authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

// Create the authentication context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userRole: 'user',
  setUserRole: () => {}
});

// Provide authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);
  const [userRole, setUserRoleState] = useState<string>('user');

  // Load authentication state and role from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwt.decode(token);
        if (decodedToken) {
          setIsLoggedInState(true);
          setUserRoleState(decodedToken.role || 'user');
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Update localStorage whenever authentication state changes
  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value);
    localStorage.setItem("isLoggedIn", value.toString());
    
    // Clear token and role if logging out
    if (!value) {
      localStorage.removeItem("token");
      setUserRoleState('user');
    }
  };

  // Set user role
  const setUserRole = (role: string) => {
    setUserRoleState(role);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      userRole, 
      setUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);