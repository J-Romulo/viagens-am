import Link from 'next/link';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-[#e0e7ff] px-4 py-8'>
      <div className='flex w-full max-w-lg flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg'>
        <div className='bg-primary-200 mb-6 rounded-full p-4'>
          <FaSearch className='text-primary-500 h-12 w-12' />
        </div>

        <h1 className='text-primary-600 mb-3 text-center text-4xl font-bold'>
          Página não encontrada
        </h1>

        <p className='mb-8 text-center text-lg text-[#6366f1]'>
          Não conseguimos encontrar a página que você está procurando.
        </p>

        <div className='flex space-x-4'>
          <Link
            href='/'
            className='flex items-center justify-center rounded-lg bg-[#4f46e5] px-6 py-3 text-white transition-colors hover:bg-[#3730a3]'
          >
            <FaHome className='mr-2' />
            Retornar
          </Link>
        </div>
      </div>
    </div>
  );
}
