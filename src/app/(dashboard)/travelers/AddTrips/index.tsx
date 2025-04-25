import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Trip } from '../../../../@types/Trip';
import { Button } from '../../../../components/Button';
import { CustomModal } from '../../../../components/Modal';
import { getUserTrips } from '../../../../services/queries/Trips';
import Loader from 'react-spinners/ClipLoader';
import { updateTravelerTrips } from '../../../../services/queries/Travelers';

interface AddTripsProps {
  clientId: string;
  currentTrips?: Trip[];
}

export function AddTrips({ clientId, currentTrips = [] }: AddTripsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>(currentTrips);
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: ['trips', clientId],
    queryFn: getUserTrips,
    refetchOnWindowFocus: false,
  });

  const updateTravelerTripsMutation = useMutation({
    mutationFn: ({ id, trips }: { id: string; trips: string[] }) =>
      updateTravelerTrips(id, trips),
    onSuccess: () => {
      toast.success('Viagens adicionadas com sucesso.');
      queryClient.invalidateQueries({ queryKey: ['traveler', clientId] });
      setIsOpen(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error(
        'Ocorreu um erro ao adicionar as viagens. Tente novamente em instantes.'
      );
    },
  });

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrips((prev) => {
      const isSelected = prev.some((c) => c._id === trip._id);
      if (isSelected) {
        return prev.filter((c) => c._id !== trip._id);
      }
      return [...prev, trip];
    });
  };

  const handleSubmit = async () => {
    await updateTravelerTripsMutation.mutateAsync({
      id: clientId,
      trips: selectedTrips.map((trip) => trip._id),
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-primary-400 hover:text-primary-500 transition hover:underline'
      >
        Atualizar viagens
      </button>
      <CustomModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        headerTitle='Atualizar lista de viagens'
      >
        <div className='flex flex-col gap-4'>
          {tripsQuery.isLoading ? (
            <div className='flex justify-center'>
              <Loader color='#4f46e5' loading={true} size={40} />
            </div>
          ) : tripsQuery.isError ? (
            <div className='text-center text-red-500'>
              Ocorreu um erro ao carregar as viagens. Tente novamente em
              instantes.
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='max-h-96 space-y-2 overflow-y-auto'>
                {tripsQuery.data?.map((trip) => (
                  <div
                    key={trip._id}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      selectedTrips.some((c) => c._id === trip._id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-primary-300 border-gray-200'
                    }`}
                    onClick={() => handleTripSelect(trip)}
                  >
                    <p className='text-primary-500 font-medium'>
                      {trip.city} - {trip.uf}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(new Date(trip.start_date))}
                    </p>
                  </div>
                ))}
              </div>
              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  onClick={() => setIsOpen(false)}
                  size='small'
                  className='border border-gray-300 hover:border-gray-400'
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  size='small'
                  disabled={updateTravelerTripsMutation.isPending}
                >
                  {updateTravelerTripsMutation.isPending ? (
                    <Loader color='#FFF' loading={true} size={20} />
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
}
