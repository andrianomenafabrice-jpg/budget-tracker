import type { Metadata, Viewport } from 'next';
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ConfirmProvider } from '@/components/ui/ConfirmProvider';
import './globals.css';

const zillaSlab = Zilla_Slab({ subsets: ['latin'], weight: ['700'], variable: '--font-display', display: 'swap' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Le Grand Livre — Suivi de budget', template: '%s — Le Grand Livre' },
  description: "Suivi de budget personnel : dépenses, revenus et objectifs d'épargne, présentés comme un registre comptable clair.",
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const SCRIPT_ANTI_FLASH = `
try {
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${zillaSlab.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANTI_FLASH }} />
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}