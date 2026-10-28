import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://evoless.com'),
  title: {
    default: 'Evoless — Creative Video Editor & Motion Designer',
    template: '%s | Evoless'
  },
  description: 'Portfolio of Houssam Elmsafer (Evoless). Professional video editing, high-retention social reels, commercial advertising, and motion design based in Casablanca, Morocco.',
  keywords: [
    'Video Editor',
    'Motion Designer',
    'Creative Advertising',
    'Premiere Pro',
    'After Effects',
    'Short-Form Video',
    'Evoless',
    'Houssam Elmsafer',
    'Casablanca',
    'Morocco Video Editor'
  ],
  authors: [{ name: 'Houssam Elmsafer (Evoless)', url: 'https://evoless.com' }],
  creator: 'Houssam Elmsafer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: 'https://evoless.com',
    siteName: 'Evoless Portfolio',
    title: 'Evoless — Creative Video Editor & Motion Designer',
    description: 'Transforming ideas into cinematic visual experiences. Commercials, UGC performance creative, and motion design.',
    images: [
      {
        url: '/images/houssam-elmsafer.jpg',
        width: 1200,
        height: 630,
        alt: 'Evoless Portfolio - Houssam Elmsafer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evoless — Creative Video Editor & Motion Designer',
    description: 'Video Editing · Motion Graphics · Creative Advertising'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('evoless_theme') || 'dark';
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
            })()`
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">

        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
