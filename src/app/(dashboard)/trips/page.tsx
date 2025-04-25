'use client';

import { useQuery } from '@tanstack/react-query';
import { PageTitle } from '../../../components/PageTitle';
import { getUserTrips } from '../../../services/queries/Trips';
import { Trip } from '../../../@types/Trip';
import Loader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';
import { useRouter } from 'next/navigation';
import { IoIosCreate } from 'react-icons/io';

const columnHelper = createColumnHelper<Trip>();

export default function Trips() {
  const router = useRouter();
  const tripsQuery = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: getUserTrips,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (tripsQuery.isError) {
      toast.error(
        'Ocorreu um erro ao tentar buscar as viagens. Tente novamente em instantes.'
      );
    }
  }, [tripsQuery.isError]);

  if (tripsQuery.isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center rounded-lg bg-white px-10 py-5 shadow-lg'>
        <PageTitle title='Viagens' />
        <Loader color={'#4f46e5'} loading={true} size={60} />
      </div>
    );
  }

  const columns = [
    columnHelper.accessor('city', {
      header: 'Cidade',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('uf', {
      header: 'Estado',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('hotel', {
      header: 'Hotel',
      cell: (info) => info.getValue(),
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
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      size: 30,
      cell: ({ row }) => (
        <Button
          onClick={() => {
            router.push(`/trips/${row.original._id}`);
          }}
          size='small'
          className='flex items-center justify-center rounded-full'
        >
          <IoIosCreate size={16} />
        </Button>
      ),
    }),
  ];

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto rounded-lg bg-white px-10 py-5 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <PageTitle title='Viagens' />
      </div>

      <Table data={tripsQuery.data} columns={columns} />

      <Button
        onClick={() => {
          router.push('/trips/create');
        }}
        size='small'
        className='mt-8'
      >
        Adicionar viagem
      </Button>
    </div>
  );
}
