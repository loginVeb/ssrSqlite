import { generateViewport } from './viewport';
import "./globals.css";
import manifest from '../../public/manifest.json';


export const metadata = {
  title: manifest.name,
  description: manifest.description,
};

export const viewport = generateViewport();

export default function RootLayout({ children }) {
  return (
    <html lang={manifest.lang} suppressHydrationWarning>
      <head>
        <meta name="application-name" content={manifest.name} />
        <meta name="description" content={manifest.description} />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" preload="true" />
        <link rel="icon" href="/favicomatic/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content={manifest.short_name} />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}