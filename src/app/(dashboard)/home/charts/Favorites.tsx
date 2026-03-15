import { Traveler } from '../../../../@types/Traveler';
import { PageTitle } from '../../../../components/PageTitle';
import Loader from 'react-spinners/ClipLoader';
import { Table } from '../../../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { cpfMask } from '../../../../utils/masks';

export type TravelerWithTripsCount = Traveler & { tripsCount: number };
interface FavoritesProps {
  isLoading: boolean;
  travelers: TravelerWithTripsCount[];
  onViewTraveler: (id: string) => void;
}
const columnHelper = createColumnHelper<TravelerWithTripsCount>();

export function Favorites({
  travelers,
  isLoading,
  onViewTraveler,
}: FavoritesProps) {
  const columns = [
    columnHelper.accessor('full_name', {
      header: 'Nome',
      cell: (info) => (
        <button
          onClick={() => onViewTraveler(info.row.original._id)}
          className='text-primary-400 hover:text-primary-500 cursor-pointer transition hover:underline'
          title='Ver detalhes do cliente'
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('cpf', {
      header: 'CPF',
      cell: (info) => cpfMask(info.getValue()),
    }),
    columnHelper.accessor('tripsCount', {
      header: 'Viagens',
      cell: (info) => info.getValue(),
    }),
  ];
  if (isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
        <PageTitle title='Clientes Favoritos' />
        <Loader color={'#4f46e5'} loading={true} size={60} />
      </div>
    );
  }
  return (
    <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
      <PageTitle title='Clientes Favoritos' />
      <Table data={travelers} columns={columns} />
    </div>
  );
}
