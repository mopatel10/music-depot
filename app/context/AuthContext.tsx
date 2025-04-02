'use client';  
import React, { createContext, useContext, useState, useEffect } from "react";
import jwt from 'jsonwebtoken';

// Define the shape of the authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Create the authentication context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userRole: 'user',
  setUserRole: () => {},
  userId: null,
  setUserId: () => {}
});

// Provide authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);
  const [userRole, setUserRoleState] = useState<string>('user');
  const [userId, setUserIdState] = useState<string | null>(null);

  // Load authentication state, role, and userId from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwt.decode(token);
        if (decodedToken) {
          setIsLoggedInState(true);
          setUserRoleState(decodedToken.role || 'user');
          setUserIdState(decodedToken.userId || null);
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
    
    // Clear token, role, and userId if logging out
    if (!value) {
      localStorage.removeItem("token");
      setUserRoleState('user');
      setUserIdState(null);
    }
  };

  // Set user role
  const setUserRole = (role: string) => {
    setUserRoleState(role);
  };

  // Set user ID
  const setUserId = (id: string | null) => {
    setUserIdState(id);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      userRole, 
      setUserRole,
      userId,
      setUserId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);