import { Traveler } from "../../@types/Traveler";
import api from "../api";

export async function getUserTravelers(): Promise<Traveler[]> {
	const { data } = await api.get(
		`/clients`
	);

	return data;
}