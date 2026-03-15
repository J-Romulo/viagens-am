'use client';

import { useQuery } from '@tanstack/react-query';
import { Traveler } from '../../../@types/Traveler';
import { listFavorites } from '../../../services/queries/Travelers';
import { Favorites, TravelerWithTripsCount } from './charts/Favorites';
import { useRouter } from 'next/navigation';
import { NextTrips } from './charts/NextTrips';
import {
  getRevenue,
  GetRevenueParams,
  listUserTrips,
} from '../../../services/queries/Trips';
import { useState } from 'react';
import { RevenueChart } from './charts/Revenue';

export default function Home() {
  const router = useRouter();

  const [revenueParams, setRevenueParams] = useState<GetRevenueParams>({
    period: '1-year',
    sort: 'monthly',
  });

  const favoriteTravelersQuery = useQuery<Traveler[]>({
    queryKey: ['favorite-travelers'],
    queryFn: listFavorites,
    refetchOnWindowFocus: false,
  });

  const nextTripsQuery = useQuery({
    queryKey: ['next-trips'],
    queryFn: listUserTrips,
    refetchOnWindowFocus: false,
  });

  const getRevenueQuery = useQuery({
    queryKey: ['trips-revenue', revenueParams], // re-fetches whenever params change
    queryFn: () => getRevenue(revenueParams),
    refetchOnWindowFocus: false,
  });

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto rounded-lg bg-white px-10 py-5 shadow-lg'>
      <div className='grid grid-cols-3 gap-4 gap-y-10'>
        <div className='col-span-3'>
          <RevenueChart
            data={getRevenueQuery.data}
            isLoading={getRevenueQuery.isLoading}
            params={revenueParams}
            onParamsChange={setRevenueParams}
          />
        </div>

        <div className='col-span-2'>
          <NextTrips
            trips={nextTripsQuery.data || []}
            isLoading={nextTripsQuery.isLoading}
            onViewTrip={(id) => router.push(`/trips/${id}`)}
          />
        </div>

        <div className='col-span-1'>
          <Favorites
            travelers={
              (favoriteTravelersQuery.data as TravelerWithTripsCount[]) || []
            }
            isLoading={favoriteTravelersQuery.isLoading}
            onViewTraveler={(id) => router.push(`/travelers/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
