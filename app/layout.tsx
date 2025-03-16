// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google'; // Optional: Google font
import Sidebar from './components/Sidebar';  // Adjust path
import { AuthProvider } from './context/AuthContext';  // Import AuthContext
import "../public/styles/globals.css";  // Global styles

const inter = Inter({ subsets: ['latin'] });



const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <html lang="en">
        <head />
        <body className={inter.className}>
          <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
