import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streaming App",
  description: "A modern streaming website using Next.js and TMDB API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4830968010691838" crossOrigin="anonymous"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-black dark:text-white`}>
        <Navbar />
        <div className="hero bg-gray-700 text-white p-8 mb-8 mt-14">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold">Welcome to Streaming App</h2>
            <p className="mt-2">Watch the latest movies and shows</p>
          </div>
        </div>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>© 2025 Streaming App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
