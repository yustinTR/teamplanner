"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { AlertTriangle } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="mb-4 size-12 text-red-600" />
          <h1 className="text-xl font-semibold">Er is iets misgegaan</h1>
          <p className="mt-2 text-sm text-gray-500">
            Er is een onverwachte fout opgetreden. Probeer het opnieuw.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Opnieuw proberen
          </button>
        </div>
      </body>
    </html>
  );
}
