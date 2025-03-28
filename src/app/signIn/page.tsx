"use client";

import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { setAuthCookie } from "../../utils/auth";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { PasswordInput } from "../../components/PasswordInput";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Loader from "react-spinners/ClipLoader";

const signInSchema = z.object({
    email: z.string()
      .email("Email inválido")
      .min(1, "Email é obrigatório"),
    
    password: z.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(256, "A senha deve ter no máximo 256 caracteres")
});

export default function SignIn() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await handleSubmit(value);
        },
        validators: {
            onChange: signInSchema,
        },
    })
    const router = useRouter();

    async function handleSubmit(data: {email: string; password: string; }) {
        try {
            const response = await api.post("auth/sign-in", { email: data.email, password: data.password });
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

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="w-full flex flex-col items-center justify-center"
            >
                <div className="space-y-6 mx-auto mt-6 w-2/3">
                    <form.Field
                        name="email"
                    >
                        {(field) => {
                            return (
                                <TextInput
                                    id={field.name}
                                    label="Email"
                                    type="email"
                                    value={field.state.value}
                                    onChange={(text) => field.handleChange(text)}
                                    placeholder="Digite sua email"
                                    ringColor={field.state.meta.errors.length ? "accent-400" : "primary-400"}
                                    required={true}
                                />
                            )
                        }}
                    </form.Field>
                    
                    <form.Field
                        name="password"
                    >
                        {(field) => {
                            return (
                                <PasswordInput
                                    id={field.name}
                                    label="Senha"
                                    value={field.state.value}
                                    onChange={(text) => field.handleChange(text)}
                                    placeholder="Digite sua senha"
                                    ringColor={field.state.meta.errors.length ? "accent-400" : "primary-400"}
                                    required={true}
                                />
                            )
                        }}
                    </form.Field>

                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <Button 
                                type="submit"
                                disabled={!canSubmit}
                            >
                                {isSubmitting ?
                                    <Loader
                                        color={"#FFF"}
                                        loading={isSubmitting}
                                        size={20}
                                    />
                                : 'Entrar'}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
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
