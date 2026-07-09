import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JauharaFeto | Edukasi & Skrining Fetomaternal',
  description: 'Webapp edukasi, kalkulator, dan skrining awal fetomaternal untuk pasien dan tenaga medis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
