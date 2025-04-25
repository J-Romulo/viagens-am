import { User } from '../../@types/User';
import api from '../api';

export async function getUserData() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function updateAvatar(avatar: FormData) {
  const { data } = await api.post('/users/avatar', avatar);
  return data;
}

export async function updateUser(
  id: string,
  user: { email: string; name: string }
): Promise<User> {
  const { data } = await api.patch(`/users/${id}`, user);
  return data;
}
