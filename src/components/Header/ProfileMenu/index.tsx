'use client';

import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../../Contexts/AuthContext';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileMenu() {
  const router = useRouter();
  const { signOut } = use(AuthContext);

  return (
    <div className='mt-1 w-48 overflow-hidden rounded-md bg-white shadow-lg'>
      <nav className='p-2'>
        <ul className='space-y-1'>
          <li>
            <button
              className='hover:bg-primary-100 flex w-full items-center rounded-md p-2'
              onClick={() => router.push('/profile')}
            >
              <FaUser className='text-primary-600 mr-3 text-lg' />
              <span className='text-primary-600 font-medium'>Perfil</span>
            </button>
          </li>

          <li className='mt-1 border-t pt-2'>
            <button
              className='hover:bg-primary-100 flex w-full items-center rounded-md p-2'
              onClick={signOut}
            >
              <FaSignOutAlt className='text-primary-600 mr-3 text-lg' />
              <span className='text-primary-600 font-medium'>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
