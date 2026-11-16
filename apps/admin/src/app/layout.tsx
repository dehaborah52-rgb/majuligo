import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const metadata: Metadata = {
  title: 'MajuliGo - Bike-Taxi Administration Portal',
  description: 'Operations and fleet management portal for MajuliGo bike-taxi platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-slate-50 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          <Header />
          <main className="p-8 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
