import { Inter } from 'next/font/google'; 
import { AuthProvider } from './context/AuthContext';  
import ClientLayout from './ClientLayout'; 
import "../public/styles/globals.css";  

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <head />
        <body className={inter.className}>
          <ClientLayout>{children}</ClientLayout> 
        </body>
      </html>
    </AuthProvider>
  );
}
