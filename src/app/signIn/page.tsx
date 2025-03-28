"use client";

import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import api from "../../services/api";
import { setAuthCookie } from "../../utils/auth";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { PasswordInput } from "../../components/PasswordInput";

export default function SignIn() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await api.post("auth/sign-in", { email, password });
            const token = response.data.token;

            localStorage.setItem("username", response.data.user.name);
            localStorage.setItem("token", token);
            await setAuthCookie(token);

            router.push("/home");
        } catch (error) {
            console.log(error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }

            toast.error("Ocorreu um erro ao tentar fazer login. Tente novamente em instantes.");
        }
    }

    return (
        <div className="relative w-5/6 h-5/6 md:w-2/5 md:h-5/6 p-1 md:p-6 flex flex-col items-center justify-center bg-neutral-100 rounded-lg shadow-lg">
            <div className="w-full flex flex-col items-center gap-x-3">
                <Image src={"/"} alt="Viagens AM logo" width={120} height={200} />
            </div>

            <form className="space-y-6 mx-auto mt-6 w-2/3" onSubmit={handleSubmit}>
                <TextInput 
                    id="email"
                    label="Email"
                    type="email"
                    onChange={(text) => setEmail(text)}
                    placeholder="Digite sua email"
                    required={true}
                />
                
                <PasswordInput
                    id="password"
                    label="Senha"
                    onChange={(text) => setPassword(text)}
                    placeholder="Digite sua senha"
                    required={true}
                />

                <Button 
                    type="submit"
                >
                    Entrar
                </Button>
            </form>

            <p className="text-center text-neutral-700 mt-4 mx-auto">
                Ainda não possui conta?{" "}
                <Link
                    href="/signUp"
                    className="text-primary-400 font-medium hover:underline"
                >
                    Registrar
                </Link>
            </p>
        </div>
    );
}
