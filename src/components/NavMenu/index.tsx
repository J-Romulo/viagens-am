'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPlane, FaUsers, FaCog } from 'react-icons/fa';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AMLogoDark from '../../assets/am-logo.png';
import Image from 'next/image';

const navItems = [
  { href: '/home', label: 'Início', icon: FaHome },
  { href: '/trips', label: 'Viagens', icon: FaPlane },
  { href: '/travelers', label: 'Clientes', icon: FaUsers },
];

const menuItemClass = `
  flex items-center rounded-md p-2 font-medium
  !text-primary-600
  !hover:bg-primary-100
  hover:!bg-primary-100 hover:!text-primary-600
  data-[active=true]:!bg-primary-100 data-[active=true]:!text-primary-600
  group-data-[collapsible=icon]:justify-center
  group-data-[collapsible=icon]:rounded-lg
  group-data-[collapsible=icon]:p-2
`;

export function NavMenu() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <Sidebar collapsible='icon' className='border-none bg-white shadow-lg'>
      <SidebarHeader className='flex h-15 flex-row items-center justify-center border-b p-3'>
        <div className='group-data-[state=collapsed]:hidden'>
          <Image
            src={AMLogoDark}
            alt='AM Viagens logo'
            width={70}
            height={100}
            unoptimized
          />
        </div>
        <SidebarTrigger className='text-primary-600 hover:bg-primary-100 hover:!text-primary-600 ml-auto group-data-[state=collapsed]:ml-0' />
      </SidebarHeader>

      <SidebarContent className='p-2 group-data-[collapsible=icon]:p-0'>
        <SidebarGroup className='group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center'>
          <SidebarGroupContent className='group-data-[collapsible=icon]:w-full'>
            <SidebarMenu className='space-y-2 group-data-[collapsible=icon]:items-center'>
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    className={menuItemClass}
                  >
                    <Link href={href}>
                      <Icon className='shrink-0 text-xl' />
                      <span className='font-medium group-data-[collapsible=icon]:hidden'>
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t p-4 group-data-[collapsible=icon]:p-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/settings')}
              className={menuItemClass}
            >
              <Link href='/settings'>
                <FaCog className='shrink-0 text-xl' />
                <span className='font-medium group-data-[collapsible=icon]:hidden'>
                  Configurações
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
