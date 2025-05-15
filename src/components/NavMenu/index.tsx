'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import icons from react-icons
import { FaHome, FaPlane, FaUsers, FaCog } from 'react-icons/fa';

export function NavMenu() {
  const pathname = usePathname();

  // Function to check if a route is active
  const isActive = (path: string) => {
    return pathname.includes(path)
      ? 'bg-primary-100 text-primary-600'
      : 'text-primary-600 hover:bg-primary-100';
  };

  return (
    <div className='h-full w-80 bg-white shadow-lg'>
      <nav className='p-4'>
        <ul className='space-y-2'>
          <li>
            <Link
              href='/home'
              className={`flex items-center rounded-md p-3 ${isActive('/home')}`}
              prefetch={false}
            >
              <FaHome className='mr-3 text-xl' />
              <span className='font-medium'>Início</span>
            </Link>
          </li>

          <li>
            <Link
              href='/trips'
              className={`flex items-center rounded-md p-3 ${isActive('/trips')}`}
              prefetch={false}
            >
              <FaPlane className='mr-3 text-xl' />
              <span className='font-medium'>Viagens</span>
            </Link>
          </li>

          <li>
            <Link
              href='/travelers'
              className={`flex items-center rounded-md p-3 ${isActive('/travelers')}`}
              prefetch={false}
            >
              <FaUsers className='mr-3 text-xl' />
              <span className='font-medium'>Clientes</span>
            </Link>
          </li>

          <li className='mt-4 border-t pt-4'>
            <Link
              href='/settings'
              className={`flex items-center rounded-md p-3 ${isActive('/settings')}`}
              prefetch={false}
            >
              <FaCog className='mr-3 text-xl' />
              <span className='font-medium'>Configurações</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
