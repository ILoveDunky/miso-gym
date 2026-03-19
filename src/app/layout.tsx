import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Miso's Gym App 💜",
  description: 'Personal workout checklist and progress tracker for my baby.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Miso's Gym App 💜",
  },
};

export const viewport: Viewport = {
  themeColor: '#B899DB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
