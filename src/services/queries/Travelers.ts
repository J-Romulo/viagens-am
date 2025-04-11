import { Traveler } from "../../@types/Traveler";
import api from "../api";

export async function getUserTravelers(): Promise<Traveler[]> {
	const { data } = await api.get(
		`/clients`
	);

	return data;
}

type CreateTraveler = Omit<Traveler, "_id" | "created_at" | "updated_at" | "user_id">;
export async function createTraveler(traveler: CreateTraveler): Promise<Traveler> {
	const { data } = await api.post(
		`/clients`,
		traveler
	);
	return data;
}
