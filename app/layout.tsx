import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/components/Providers/Providers';
import Header from '@/components/Header/Header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Restock Console', template: '%s | Restock Console' },
  description: 'An internal procurement tool for reviewing warehouse stock and restocking needs.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
