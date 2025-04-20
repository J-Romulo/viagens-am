"use client"

import { createContext, useState } from "react";
import { User } from "../@types/User";
import api from "../services/api";
import { deleteAuthCookie, setAuthCookie } from "../utils/auth";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import * as React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../services/queries/User";

type SignInCredentials = {
	email: string;
	password: string;
};

export type AuthContextData = {
	user: User | null;
	signIn(credentials: SignInCredentials): Promise<void>;
	signOut(): void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>): React.ReactNode{
    const router = useRouter();
    
    const [user, setUser] = useState<User | null>(null)
    const token = typeof window !== 'undefined' ? localStorage.getItem('@AM:token') : null;

    React.useEffect(() => {
        if(token){
            userDataQuery.refetch()
        }
    }, [token])

    const userDataQuery = useQuery({
		queryKey: ['fetchUserAccessData'],
		queryFn: getUserData,
        enabled: false,
        retry: false,
        staleTime: Infinity,
    });
    
    React.useEffect(() => {
        if(userDataQuery.isSuccess){
            setUser(userDataQuery.data)
        }

        if(userDataQuery.isError){
            console.log(userDataQuery.error);
            toast.error('Ocorreu um problema ao buscar as informações do usuário');
            signOut();
        }
    }, [userDataQuery])

    async function signIn({ email, password }: SignInCredentials) {
		try {
            const response = await api.post("auth/sign-in", { email, password });
            const token = response.data.token;

            localStorage.setItem("@AM:token", token);

            setUser(response.data.user);
            await setAuthCookie(token);
		} catch (error) {
            console.log(error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }

            toast.error("Ocorreu um erro ao tentar fazer login. Tente novamente em instantes.");
		}
	}

    async function signOut() {
        console.log('test2')
		clearAuthState();
		router.push("/signIn");
	}

    async function clearAuthState() {
		setUser(null)
		localStorage.clear();
        deleteAuthCookie()
	}

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signOut,
            }}
        >
            { children }
        </AuthContext.Provider>
    );
}