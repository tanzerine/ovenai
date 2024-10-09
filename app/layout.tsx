import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import MainLayout from '../components/MainLayout'; // Adjust the import path as necessary
import { Analytics } from "@vercel/analytics/react"


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <MainLayout>
            <Analytics />
            {children}
          </MainLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
