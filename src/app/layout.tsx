import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import SmoothScrolling from '@/components/SmoothScrolling';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SiteBoard - Your Project. One Board.',
  description: 'Clean, simple, and authoritative real estate project management. Stop guessing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrolling>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-ZDY6WRYXEL"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-ZDY6WRYXEL');
            `}
          </Script>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
