import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sight Moon - Moon Position Tracker",
  description: "Discover the moon's position in the sky with real-time tracking, compass visualization, and astronomical data.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: ["moon", "astronomy", "moon position", "azimuth", "altitude", "compass", "sky tracking"],
  authors: [{ name: "Sight Moon" }],
  creator: "Sight Moon",
  publisher: "Sight Moon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sight-moon.zameel7.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sight Moon - Moon Position Tracker",
    description: "Discover the moon's position in the sky with real-time tracking, compass visualization, and astronomical data.",
    url: 'https://sight-moon.zameel7.me',
    siteName: 'Sight Moon',
         images: [
       {
         url: '/og-image.png',
         width: 1200,
         height: 630,
         alt: 'Sight Moon - Moon Position Tracker',
       },
     ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sight Moon - Moon Position Tracker",
    description: "Discover the moon's position in the sky with real-time tracking, compass visualization, and astronomical data.",
         images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
