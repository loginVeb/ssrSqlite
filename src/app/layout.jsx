// import { generateViewport } from './viewport';
import "./globals.css";
import manifest from '../../public/manifest.json';


export const metadata = {
  title: manifest.name,
  description: manifest.description,
};

// export const viewport = generateViewport();
export const viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    //suppressHydrationWarning
    <html lang={manifest.lang} >
      <head>
        <meta name="application-name" content={manifest.name} />
        <meta name="description" content={manifest.description} />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicomatic/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content={manifest.short_name} />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        {/* <link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css"></link> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
