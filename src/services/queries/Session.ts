import api from '../api';

export async function forgotPassword(email: string) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(password: string, token: string) {
  const { data } = await api.post('/auth/reset-password', { password, token });
  return data;
}
