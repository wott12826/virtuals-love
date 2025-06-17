import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import type { Metadata } from 'next';
import { ModalProvider } from './contexts/ModalContext';
import { ChatProvider } from './contexts/ChatContext';
import { WalletProvider } from './contexts/WalletContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FLIRT GIRLS',
  description: 'FLIRT GIRLS is a new way to connect with the internet\'s most irresistible personalities — reimagined as anime-style AI companions. We collaborate with real creators and models to bring their digital alter egos to life: flirty, stylized, and always online.',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased gradient-bg min-h-screen pt-14 sm:pt-16`}>
        <WalletProvider>
          <ChatProvider>
            <ModalProvider>
              <Navbar />
              {children}
            </ModalProvider>
          </ChatProvider>
        </WalletProvider>
      </body>
    </html>
  );
} 