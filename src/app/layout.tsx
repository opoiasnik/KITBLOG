import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutContent from "@/components/LayoutContent";
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
  title: "KITBLOG - Modern Blog Platform",
  description: "A modern blog platform built with Next.js 13+, Redux Toolkit, TypeScript, Firebase Auth, Firestore, and Zod validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
