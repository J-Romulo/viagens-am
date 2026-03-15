import { Room, Trip } from '../../@types/Trip';
import api from '../api';

export async function getUserTrips(): Promise<Trip[]> {
  const { data } = await api.get(`/trips`);

  return data;
}

export async function getTripById(id: string): Promise<Trip> {
  const { data } = await api.get(`/trips/${id}`);

  return data;
}

export async function listUserTrips(): Promise<Trip[]> {
  const { data } = await api.get(`/trips/list`, {
    params: {
      page: 1,
      quantity: 10,
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  return data;
}

export type Revenue = {
  total_revenue: number;
  future_revenue: number;
  past_revenue: number;
  revenue_by_period: { period: string; revenue: number }[];
};

export type GetRevenueParams = {
  period: '1-year' | '2-year' | '5-year' | 'all-time';
  sort: 'monthly' | 'quarterly' | 'semester';
};
export async function getRevenue({
  period,
  sort,
}: GetRevenueParams): Promise<Revenue> {
  const { data } = await api.get(`/trips/revenue`, {
    params: {
      period,
      sort,
    },
  });

  return data;
}

type CreateTrip = Omit<
  Trip,
  '_id' | 'user_id' | 'clients' | 'created_at' | 'updated_at' | 'rooms'
>;

export async function createTrip(trip: CreateTrip): Promise<Trip> {
  const { data } = await api.post(`/trips`, trip);
  return data;
}

type UpdateTrip = Partial<
  Omit<Trip, '_id' | 'user_id' | 'clients' | 'created_at' | 'updated_at'>
>;
export async function updateTrip(id: string, trip: UpdateTrip): Promise<Trip> {
  const { data } = await api.patch(`/trips/${id}`, trip);
  return data;
}

export async function updateTripClients(
  id: string,
  rooms: {
    doubleCouple: Room[];
    doubleSingle: Room[];
    triple: Room[];
  }
): Promise<Trip> {
  const { data } = await api.put(`/trips/${id}`, { rooms });
  return data;
}
