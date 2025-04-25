import { Traveler } from '../../@types/Traveler';
import api from '../api';

export async function getUserTravelers(): Promise<Traveler[]> {
  const { data } = await api.get(`/clients`);

  return data;
}

export async function getTravelerById(id: string): Promise<Traveler> {
  const { data } = await api.get(`/clients/${id}`);

  return data;
}

type CreateTraveler = Omit<
  Traveler,
  '_id' | 'created_at' | 'updated_at' | 'user_id'
>;
export async function createTraveler(
  traveler: CreateTraveler
): Promise<Traveler> {
  const { data } = await api.post(`/clients`, traveler);
  return data;
}

type UpdateTraveler = Partial<
  Omit<Traveler, '_id' | 'user_id' | 'created_at' | 'updated_at'>
>;
export async function updateTraveler(
  id: string,
  traveler: UpdateTraveler
): Promise<Traveler> {
  const { data } = await api.patch(`/clients/${id}`, traveler);
  return data;
}

export async function updateTravelerTrips(
  id: string,
  trips: string[]
): Promise<Traveler> {
  const { data } = await api.put(`/clients/${id}`, { trips });
  return data;
}
