import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteSettings } from '@/lib/cms-store';

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://evoless.com'),
  title: {
    default: 'Evoless — Video Editor & Motion Designer',
    template: '%s | Evoless',
  },
  description:
    'Portfolio of Houssam Elmsafer (Evoless). Video editing, commercial advertising, short-form rhythm, and motion design based in Casablanca.',
  keywords: [
    'Video Editor',
    'Motion Designer',
    'Commercial Editing',
    'Premiere Pro',
    'After Effects',
    'Short-Form Video',
    'Evoless',
    'Houssam Elmsafer',
    'Casablanca',
  ],
  authors: [{ name: 'Houssam Elmsafer (Evoless)', url: 'https://evoless.com' }],
  creator: 'Houssam Elmsafer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: 'https://evoless.com',
    siteName: 'Evoless',
    title: 'Evoless — Video Editor & Motion Designer',
    description:
      'Selected video editing, commercial films, short-form campaigns, and motion design by Houssam Elmsafer.',
    images: [
      {
        url: '/images/houssam-elmsafer.jpg',
        width: 1200,
        height: 630,
        alt: 'Evoless — Houssam Elmsafer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evoless — Video Editor & Motion Designer',
    description: 'Video Editing · Motion Design · Commercial Rhythm',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSiteSettings();
  const defaultTheme: 'dark' | 'light' = settings.defaultTheme === 'light' ? 'light' : 'dark';

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${plusJakarta.variable} ${defaultTheme}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var fallback = '${defaultTheme}';
                var saved = localStorage.getItem('evoless_theme') || fallback;
                var root = document.documentElement;
                if (saved === 'light') {
                  root.classList.add('light');
                  root.classList.remove('dark');
                  root.setAttribute('data-theme', 'light');
                  root.style.colorScheme = 'light';
                } else {
                  root.classList.add('dark');
                  root.classList.remove('light');
                  root.setAttribute('data-theme', 'dark');
                  root.style.colorScheme = 'dark';
                }
              } catch(e){}
            })()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
