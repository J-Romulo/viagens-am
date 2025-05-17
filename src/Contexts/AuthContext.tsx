'use client';

import { createContext, useEffect, useState } from 'react';
import { User } from '../@types/User';
import api from '../services/api';
import { deleteAuthCookie, setAuthCookie } from '../utils/auth';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/queries/User';

type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthContextData = {
  user: User | null;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUserData(user: User): void;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('@AM:token') : null;

  React.useEffect(() => {
    if (token) {
      setAuthCookie(token);
      userDataQuery.refetch();
    }
  }, [token]);

  const userDataQuery = useQuery({
    queryKey: ['fetchUserAccessData'],
    queryFn: getUserData,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    enabled: false,
  });

  useEffect(() => {
    if (userDataQuery.isSuccess && userDataQuery.data) {
      setUser(userDataQuery.data);
    }

    if (userDataQuery.isError && userDataQuery.error) {
      console.log(userDataQuery.error);
      toast.error('Ocorreu um problema ao buscar as informações do usuário');
      signOut();
    }
  }, [
    userDataQuery.isSuccess,
    userDataQuery.isError,
    userDataQuery.data,
    userDataQuery.error,
  ]);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('auth/sign-in', { email, password });
      const { token, refreshToken } = response.data;

      localStorage.setItem('@AM:token', token);
      localStorage.setItem('@AM:refreshToken', refreshToken);

      setUser(response.data.user);
      await setAuthCookie(token);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error(
        'Ocorreu um erro ao tentar fazer login. Tente novamente em instantes.'
      );
    }
  }

  async function signOut() {
    clearAuthState();
    router.push('/signIn');
  }

  async function clearAuthState() {
    setUser(null);
    localStorage.clear();
    deleteAuthCookie();
  }

  async function updateUserData(user: User) {
    setUser(user);
    userDataQuery.refetch();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
