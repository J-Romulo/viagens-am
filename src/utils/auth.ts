'use server';
import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
  const oneDayInFuture = new Date();

  oneDayInFuture.setDate(oneDayInFuture.getDate() + 7);

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    expires: oneDayInFuture,
  });
}

export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
