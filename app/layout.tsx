import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UW Compass',
  description: 'Find UW resources by describing your situation in plain language.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
