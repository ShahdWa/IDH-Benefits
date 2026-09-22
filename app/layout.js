import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'IDH Benefits | Exclusive perks for our team',
  description: 'Explore IDH benefits with an interactive, searchable interface. Exclusive discounts on restaurants, travel, health and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#faf8f5] text-zinc-900 selection:bg-[#fee2e2] selection:text-[#c8102e]">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
