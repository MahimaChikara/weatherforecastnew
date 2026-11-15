import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Skyline | Weather & Air Quality', description: '7-day forecasts and air quality for Pune, Dubai, and New York' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
