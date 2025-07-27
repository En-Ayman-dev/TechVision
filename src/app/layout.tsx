import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechVision - Innovative Technology Solutions',
  description: 'Welcome to TechVision, a modern and innovative technology company.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
