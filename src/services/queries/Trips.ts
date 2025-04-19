import { Room, Trip } from "../../@types/Trip";
import api from "../api";

export async function getUserTrips(): Promise<Trip[]> {
	const { data } = await api.get(
		`/trips`
	);

	return data;
}

export async function getTripById(id: string): Promise<Trip> {
	const { data } = await api.get(
		`/trips/${id}`
	);

	return data;
}

type CreateTrip = Omit<Trip, "_id" | "user_id" | "clients" | "created_at" | "updated_at">;

export async function createTrip(trip: CreateTrip): Promise<Trip> {
	const { data } = await api.post(
		`/trips`,
		trip
	);
	return data;
}

type UpdateTrip = Partial<Omit<Trip, "_id" | "user_id" | "clients" | "created_at" | "updated_at">>;
export async function updateTrip(id: string, trip: UpdateTrip): Promise<Trip> {
	const { data } = await api.patch(
		`/trips/${id}`,
		trip
	);
	return data;
}

export async function updateTripClients(id: string, rooms: {
	doubleCouple: Room[],
	doubleSingle: Room[],
	triple: Room[]
}): Promise<Trip> {
	const { data } = await api.put(
		`/trips/${id}`,
		{ rooms }
	);
	return data;
}