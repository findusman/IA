// app/layout.tsx (Root layout for the entire app, but you can nest this under /dashboard if needed)
'use client';

import './globals.css'; // Assuming you have global styles
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={plusJakartaSans.variable}
    >
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <title>Profectia.ai - AI-Powered Insights Platform</title>
        <meta
          name='description'
          content='Connect your tools and unlock AI-powered insights across your workflow'
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
