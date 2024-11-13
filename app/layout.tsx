import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import MainLayout from '../components/MainLayout';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'

export const metadata: Metadata = {
  title: "Oven AI | High-Quality 3D Icon Generator for Designers & Developers",
  description: "Create unique, cohesive 3D icons for any subject with Oven AI. Perfect for prototyping, branding, and tech projects. Features AI-powered design and background removal. Start free!",
  keywords: "3D icon generator, AI design, background removal, prototyping, branding, tech startup, Oven AI",
  openGraph: {
    title: "Oven AI | Create Professional 3D Icons Instantly",
    description: "Generate high-quality, unique 3D icons for your design and development projects. AI-powered, with background removal feature.",
    type: "website",
    images: [
      {
        url: "/path-to-your-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Oven AI 3D Icon Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oven AI: AI-Powered 3D Icon Generator",
    description: "Create professional, unique 3D icons for your projects. Start free, pay as you grow.",
    images: ["/path-to-your-twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.yourdomain.com",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-145NLXMVCJ`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-145NLXMVCJ');
              `,
            }}
          />
        </head>
        <body className="antialiased">
          <MainLayout>
            <Analytics />
            {children}
          </MainLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}