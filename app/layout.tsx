import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  ClerkProvider,
  SignedOut,
  SignedIn,
  SignUpButton,
} from '@clerk/nextjs';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DocChat AI',
  description: 'AI chat powered by your documents',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-gray-50 dark:bg-gray-900">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 dark:text-gray-100`}
        >
          <SignedOut>
            <main className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
              <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to DocChat AI</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please sign up to access document-based AI chat.
                </p>
                <SignUpButton>
                  <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                    Sign Up / Log In
                  </button>
                </SignUpButton>
              </div>
            </main>
          </SignedOut>

          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
