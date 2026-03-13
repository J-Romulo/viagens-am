import { Header } from '../../components/Header';
import { NavMenu } from '../../components/NavMenu';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <NavMenu />
      <SidebarInset>
        <Header />
        <main className='bg-primary-100 flex-1 overflow-y-auto p-2'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
