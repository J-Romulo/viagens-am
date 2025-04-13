import { Trip } from "../../@types/Trip";
import api from "../api";

export async function getUserTrips(): Promise<Trip[]> {
	const { data } = await api.get(
		`/trips`
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