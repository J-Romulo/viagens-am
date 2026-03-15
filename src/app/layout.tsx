import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import ReactQueryProvider from '../utils/ReactQueryProvider';
import { AuthProvider } from '../Contexts/AuthContext';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Viagens AM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={cn('font-sans', inter.variable)}>
      <body className='flex flex-col items-center justify-center'>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
        <ToastContainer
          autoClose={8000}
          draggable
          style={{ fontSize: '0.8rem' }}
        />
      </body>
    </html>
  );
}
