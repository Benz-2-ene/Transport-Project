import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Q-Ride | Move Smarter. Ride Better.',
  description: 'Mobility platform built by MB-Connect Dev Team',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
