import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArdStreaming – Watch Movies & Shows Online",
  description: "Stream the latest trending movies and shows in cinematic quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Inter font — avoids Turbopack next/font/google resolution bug */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4830968010691838"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        <div id="navbar-root">
          {/* Navbar is imported via component */}
        </div>
        <NavbarWrapper />
        <div style={{ paddingTop: "var(--nav-height)" }}>
          {children}
        </div>
        <footer
          style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border)",
            marginTop: "5rem",
            padding: "2.5rem 1rem",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                ArdStreaming
              </span>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--accent)" }}>
                Movies
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textAlign: "center",
                maxWidth: "480px",
              }}
            >
              Stream trending movies and shows online. Powered by TMDB. For
              entertainment purposes only.
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} ArdStreamingMovies. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Separate import to keep layout a server component
import NavbarWrapper from "@/components/Navbar";
