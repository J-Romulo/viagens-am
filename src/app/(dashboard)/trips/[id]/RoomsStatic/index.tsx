import { useRouter } from 'next/navigation';
import { IoMdBed } from 'react-icons/io';
import { IoPerson } from 'react-icons/io5';
import { User } from '../../../../../@types/User';
import { Room, Trip } from '../../../../../@types/Trip';
import React from 'react';
import { AddTravelers } from '../AddTravelers';
import { getRoomTypeDisplayName } from '../../../../../utils/text';

type Rooms = {
  doubleCouple?: Room[];
  doubleSingle?: Room[];
  triple?: Room[];
};

type RoomType = keyof Rooms;

interface RoomsStaticProps {
  tripId: string;
  tripData: Trip;
  user: User;
  getTotalTravelers: () => number;
  generatePDF: (tripData: Trip, user: User) => void;
}

const ROOM_TYPES: RoomType[] = ['doubleCouple', 'doubleSingle', 'triple'];

interface RoomTypeSectionProps {
  label: string;
  rooms: Room[] | undefined;
  onTravelerClick: (travelerId: string) => void;
}

function RoomTypeSection({
  label,
  rooms,
  onTravelerClick,
}: RoomTypeSectionProps) {
  return (
    <details open className='overflow-hidden rounded-lg border border-gray-200'>
      <summary className='flex cursor-pointer list-none items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3 [&::-webkit-details-marker]:hidden'>
        <h4 className='font-medium text-gray-900'>
          {label} ({rooms?.length || 0})
        </h4>
        <span className='details-open:rotate-180 text-xs text-gray-400 transition-transform'>
          ▼
        </span>
      </summary>

      <div className='space-y-4 p-4'>
        {!rooms || rooms.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>
            Nenhum quarto deste tipo adicionado.
          </div>
        ) : (
          rooms.map((room, index) => (
            <div key={room.id} className='rounded-lg border border-gray-200'>
              <div className='flex justify-between border-b border-gray-200 bg-gray-50 px-4 py-2'>
                <div className='flex items-center'>
                  <IoMdBed className='text-primary-500 mr-2' size={18} />
                  <span className='font-medium'>Quarto #{index + 1}</span>
                </div>
                <span className='text-sm text-gray-600'>
                  {room.travelers?.length || 0}{' '}
                  {(room.travelers?.length || 0) === 1 ? 'cliente' : 'clientes'}
                </span>
              </div>

              {!room.travelers || room.travelers.length === 0 ? (
                <div className='p-3 text-sm text-gray-500'>
                  Nenhum cliente adicionado
                </div>
              ) : (
                <div className='divide-y divide-gray-100'>
                  {room.travelers.map((traveler) => (
                    <div
                      key={traveler._id}
                      className='flex items-center justify-between p-3 hover:bg-gray-50'
                    >
                      <div>
                        <p className='text-primary-500 font-medium'>
                          {traveler.full_name}
                        </p>
                        <p className='text-sm text-gray-600'>
                          CPF: {traveler.cpf}
                        </p>
                      </div>
                      <button
                        onClick={() => onTravelerClick(traveler._id)}
                        className='text-primary-400 hover:text-primary-500 rounded-full p-1 transition hover:bg-gray-100'
                        title='Ver detalhes do cliente'
                      >
                        <IoPerson size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </details>
  );
}

export function RoomsStatic({
  tripId,
  tripData,
  user,
  getTotalTravelers,
  generatePDF,
}: RoomsStaticProps) {
  const router = useRouter();

  return (
    <div className='mt-16 w-full'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-primary-500 text-lg font-semibold'>
          Clientes ({getTotalTravelers()})
        </h3>
        <div className='align-center flex gap-x-3'>
          <AddTravelers tripId={tripId} currentRooms={tripData.rooms} />
          <button
            onClick={() => generatePDF(tripData, user)}
            className='text-primary-400 hover:text-primary-500 transition hover:underline'
          >
            Gerar relatório de clientes
          </button>
        </div>
      </div>

      <div className='mb-10 space-y-8'>
        {ROOM_TYPES.map((type) => (
          <RoomTypeSection
            key={type}
            label={getRoomTypeDisplayName(type)}
            rooms={tripData.rooms?.[type]}
            onTravelerClick={(travelerId) =>
              router.push(`/travelers/${travelerId}`)
            }
          />
        ))}
      </div>
    </div>
  );
}
