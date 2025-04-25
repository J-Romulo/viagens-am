import { FaHardHat, FaTools } from 'react-icons/fa';

export function BuildingContent({
  title = 'Em breve...',
  message = 'Esta página está atualmente em desenvolvimento e estará disponível em breve.',
}) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center overflow-y-auto rounded-lg px-10 py-12'>
      <div className='text-primary-500 mb-4 flex items-center justify-center space-x-3'>
        <FaHardHat size={32} />
        <FaTools size={32} />
      </div>
      <h1 className='mb-4 text-3xl font-bold text-gray-800'>{title}</h1>
      <p className='max-w-md text-center text-lg text-gray-600'>{message}</p>
    </div>
  );
}
