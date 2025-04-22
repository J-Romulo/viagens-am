import api from "../api";

export async function getUserData() {
	const { data } = await api.get('/auth/me');
	return data;
}

export async function updateAvatar(avatar: FormData) {
	const { data } = await api.post('/users/avatar', avatar);
	return data;
}