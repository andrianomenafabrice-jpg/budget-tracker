import type { Metadata } from 'next';
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Le Grand Livre — Suivi de budget',
  description: 'Suivi de budget personnel : dépenses, revenus et objectifs d\'épargne.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${zillaSlab.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}