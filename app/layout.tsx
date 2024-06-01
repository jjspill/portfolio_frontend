import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from './components/Navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from './contexts/UserContext';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | James Spillmann',
    default: 'James Spillmann - Software Engineer and Developer',
  },
  description:
    'James Spillmann is a software engineer based in New York, specializing in building modern, responsive websites and applications using Next.js, React, and cutting-edge web technologies.',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'James Spillmann - Software Engineer and Developer',
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jamesspillmann.com',
    siteName: 'James Spillmann',
    description:
      'Discover the professional world of James Spillmann, a New York-based software engineer specializing in Next.js and React.',
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Explore the projects and skills of James Spillmann, software engineer specialized in Next.js and React technologies.',
  },
  alternates: {
    canonical: 'https://www.jamesspillmann.com',
  },
  metadataBase: new URL('https://www.jamesspillmann.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
