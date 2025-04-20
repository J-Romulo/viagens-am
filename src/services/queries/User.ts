import api from "../api";

export async function getUserData() {
	const { data } = await api.get('/auth/me');
	return data;
}