import { PageTitle } from '../../../../components/PageTitle';
import Loader from 'react-spinners/ClipLoader';
import { Table } from '../../../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { moneyMask } from '../../../../utils/masks';
import { Trip } from '../../../../@types/Trip';

interface NextTripsProps {
  isLoading: boolean;
  trips: Trip[];
  onViewTrip: (id: string) => void;
}
const columnHelper = createColumnHelper<Trip>();

export function NextTrips({ trips, isLoading, onViewTrip }: NextTripsProps) {
  const columns = [
    columnHelper.accessor('city', {
      header: 'Cidade',
      cell: (info) => (
        <button
          onClick={() => onViewTrip(info.row.original._id)}
          className='text-primary-400 hover:text-primary-500 cursor-pointer transition hover:underline'
          title='Ver detalhes da viagem'
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('start_date', {
      header: 'Ida',
      cell: (info) =>
        Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, // 24-hour format
        })
          .format(new Date(info.getValue()))
          .replace(',', ' às'),
    }),
    columnHelper.accessor('finish_date', {
      header: 'Volta',
      cell: (info) =>
        Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, // 24-hour format
        })
          .format(new Date(info.getValue()))
          .replace(',', ' às'),
    }),
    columnHelper.accessor('individual_price', {
      header: 'Preço',
      cell: (info) => moneyMask(info.getValue().toFixed(2)),
    }),
    columnHelper.display({
      id: 'clients',
      header: 'Clientes',
      cell: ({ row }) =>
        `${row.original.clients?.length || 0} / ${row.original.expected_clients}`,
    }),
  ];
  if (isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
        <PageTitle title='Próximas viagens agendadas' />
        <Loader color={'#4f46e5'} loading={true} size={60} />
      </div>
    );
  }
  return (
    <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
      <PageTitle title='Próximas viagens agendadas' />
      <Table data={trips} columns={columns} />
    </div>
  );
}
