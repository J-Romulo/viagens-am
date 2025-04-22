"use client";

import { useForm } from "@tanstack/react-form";
import { PageTitle } from "../../../../components/PageTitle";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createTraveler } from "../../../../services/queries/Travelers";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";
import { Button } from "../../../../components/Button";
import Loader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import { cpfMask, parseMaskedCPFToRaw } from "../../../../utils/masks";
import { IoIosArrowBack } from "react-icons/io";

const createTravelerSchema = z.object({
    full_name: z.string()
      .min(1, "O campo nome é obrigatório."),
    
    birth_date: z.date().min(new Date("1900-01-01"), "A data de nascimento deve ser maior que 1900."),
    
    cpf: z.string()
      .min(1, "O campo CPF é obrigatório."),
    
    rg: z.string()
      .min(1, "O campo RG é obrigatório.")
});

export default function CreateTraveler() {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            full_name: "",
            birth_date: new Date(),
            cpf: "",
            rg: ""
        },
        onSubmit: async ({ value }) => {
            await handleSubmit(value);
        },
        validators: {
            onSubmit: createTravelerSchema,
        },
    })
    
    const createTravelerMutation = useMutation({
        mutationFn: createTraveler,
        onSuccess: () => {
            toast.success("Cliente criado com sucesso.");
            router.push("/travelers");
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }

            toast.error("Ocorreu um erro ao criar o cliente. Tente novamente em instantes.");
        }
    });

    async function handleSubmit(data: {full_name: string; birth_date: Date; cpf: string; rg: string; }) {
        await createTravelerMutation.mutateAsync({
            full_name: data.full_name,
            birth_date: data.birth_date,
            cpf: data.cpf,
            rg: data.rg
        });
    }
    
    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg px-10 py-5 w-full h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                  <div
                      className="rounded-full p-2 hover:text-primary-500 transition text-primary-400 cursor-pointer"
                      onClick={() => router.back()}
                  >
                      <IoIosArrowBack size={30} />
                  </div>
                  <PageTitle title="Criar cliente" />
              </div>
            </div>

            <form                 
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="w-full flex flex-col items-center justify-center"
            >
                <div className="space-y-6 mx-auto w-2/3">
                    <div 
                        className="w-full flex flex-row items-top gap-x-5"
                    >
                        <form.Field
                            name="full_name"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="Nome"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(text) => field.handleChange(text)}
                                        placeholder="Nome do cliente"
                                        errors={field.state.meta.errors}
                                        required={true}
                                        className="w-lg"
                                    />
                                )
                            }}
                        </form.Field>
                        
                        <form.Field
                            name="birth_date"
                        >
                            {(field) => {
                                return (
                                    <DateInput
                                        id={field.name}
                                        label="Data de nascimento"
                                        value={field.state.value}
                                        onChange={(date) => field.handleChange(date)}
                                        required={true}
                                    />
                                )
                            }}
                        </form.Field>
                    </div>

                    <div 
                        className="w-full flex flex-row items-center gap-x-5"
                    >
                        <form.Field
                            name="cpf"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="CPF"
                                        type="text"
                                        value={cpfMask(field.state.value)}
                                        onChange={(text) => field.handleChange(parseMaskedCPFToRaw(text))}
                                        placeholder="CPF"
                                        required={true}
                                    />
                                )
                            }}
                        </form.Field>
                        
                        <form.Field
                            name="rg"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="RG"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(text) => field.handleChange(text)}
                                        placeholder="RG"
                                        required={true}
                                    />
                                )
                            }}
                        </form.Field>
                    </div>

                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <Button 
                                type="submit"
                                disabled={!canSubmit}
                                size="small"
                                className="mt-8"
                            >
                                {isSubmitting ?
                                    <Loader
                                        color={"#FFF"}
                                        loading={isSubmitting}
                                        size={20}
                                    />
                                : 'Salvar'}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
                
            </form>
        </div>
    )
}
