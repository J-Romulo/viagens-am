'use client';

import Image from 'next/image';
import { CustomPopover } from '../Popover';
import { use, useState } from 'react';
import { ProfileMenu } from './ProfileMenu';
import { AuthContext } from '../../Contexts/AuthContext';
import AMLogoDark from '../../assets/am-logo-dark.png';

export function Header() {
  const { user } = use(AuthContext);

  const [isProfileMenuOpened, setIsProfileMenuOpened] = useState(false);

  return (
    <div className='bg-primary-500 flex h-15 w-full items-center justify-between p-4 text-white shadow-lg'>
      <div>
        <Image
          src={AMLogoDark}
          alt='AM Viagens logo'
          width={100}
          height={150}
          unoptimized
        />
      </div>
      <div className='flex items-center gap-x-3'>
        <p>{user?.name}</p>

        <CustomPopover
          isOpen={isProfileMenuOpened}
          onClose={() => setIsProfileMenuOpened(false)}
          content={<ProfileMenu />}
        >
          {user && user.avatar ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/avatars/${user.avatar}`}
              alt='Imagem de perfil'
              className='h-13 w-13 cursor-pointer rounded-full bg-white object-contain'
              unoptimized
              width={13}
              height={13}
              onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}
            />
          ) : (
            <div
              className='bg-primary-100 flex h-13 w-13 cursor-pointer items-center justify-center rounded-full'
              onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}
            >
              <span className='text-primary-500 text-4xl font-bold'>
                {user ? user.name.charAt(0).toUpperCase() : 'AM'}
              </span>
            </div>
          )}
        </CustomPopover>
      </div>
    </div>
  );
}
