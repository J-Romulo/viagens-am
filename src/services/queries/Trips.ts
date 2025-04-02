import { Trip } from "../../@types/Trip";
import api from "../api";

export async function getUserTrips(): Promise<Trip[]> {
	const { data } = await api.get(
		`/trips`
	);

	return data;
}