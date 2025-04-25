import { BuildingContent } from '../../../components/BuildingContent';

export default function Home() {
  return (
    <div className='flex h-full w-full flex-col overflow-y-auto rounded-lg bg-white px-10 py-5 shadow-lg'>
      <BuildingContent />
    </div>
  );
}
