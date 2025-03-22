'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import "@/public/styles/globals.css";
import { usePathname } from 'next/navigation';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoggedOut = pathname === "/";

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <section className={`layout ${isLoggedOut ? 'logged-out' : ''}`}>
      {!isLoggedOut && <Sidebar onToggle={handleSidebarToggle} />}
      
      <div className={`body ${isSidebarCollapsed && !isLoggedOut ? 'collapsed' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default ClientLayout;
