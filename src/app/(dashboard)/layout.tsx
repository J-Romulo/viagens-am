import { Header } from '../../components/Header';
import { NavMenu } from '../../components/NavMenu';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen w-full flex-col items-center'>
      <Header />
      <div className='align-items-center bg-primary-100 flex w-full flex-1 justify-center overflow-y-hidden'>
        <NavMenu />
        <div className='flex h-full w-full p-2'>{children}</div>
      </div>
    </div>
  );
}
