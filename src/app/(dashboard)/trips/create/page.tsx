"use client";

import { Updater, useForm } from "@tanstack/react-form";
import { PageTitle } from "../../../../components/PageTitle";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createTrip } from "../../../../services/queries/Trips";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";
import { Button } from "../../../../components/Button";
import Loader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import { CurrencyInput } from "../../../../components/CurrencyInput";

const createTripSchema = z.object({
    city: z.string()
      .min(1, "O campo cidade é obrigatório."),
    
    uf: z.string()
      .min(2, "O campo UF é obrigatório.")
      .max(2, "O campo UF deve ter 2 caracteres."),
    
    hotel: z.string()
      .min(1, "O campo hotel é obrigatório."),
    
    start_date: z.date(),
    
    finish_date: z.date(),
    
    individual_price: z.number()
      .min(0, "O preço individual deve ser maior que 0."),
    
    expected_clients: z.number()
      .min(1, "O número de clientes esperados deve ser maior que 0.")
}).refine((data) => {
    return data.finish_date > data.start_date;
}, {
    message: "A data de retorno deve ser posterior à data de saída",
    path: ["finish_date"],
});

type FormValues = {
    city: string;
    uf: string;
    hotel: string;
    start_date: Date;
    finish_date: Date;
    individual_price: number;
    expected_clients: number;
};

export default function CreateTrip() {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            city: "",
            uf: "",
            hotel: "",
            start_date: new Date(),
            finish_date: new Date(),
            individual_price: 0,
            expected_clients: 0,
        },
        onSubmit: async ({ value }) => {
            await handleSubmit(value);
        },
        validators: {
            onSubmit: createTripSchema,
        },
    })
    
    const createTripMutation = useMutation({
        mutationFn: createTrip,
        onSuccess: () => {
            toast.success("Viagem criada com sucesso.");
            router.push("/trips");
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                toast.error(error.response?.data.message.join(", "));
                return;
            }

            toast.error("Ocorreu um erro ao criar a viagem. Tente novamente em instantes.");
        }
    });

    async function handleSubmit(data: FormValues) {
        try {
            await createTripMutation.mutateAsync({
                city: data.city,
                uf: data.uf,
                hotel: data.hotel,
                start_date: data.start_date,
                finish_date: data.finish_date,
                individual_price: data.individual_price,
                expected_clients: data.expected_clients,
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg px-10 py-5 w-full h-full">
            <PageTitle title="Criar viagem" />

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
                            name="city"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="Destino"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(text) => field.handleChange(text)}
                                        placeholder="Cidade da viagem"
                                        errors={field.state.meta.errors}
                                        required={true}
                                        className="w-lg"
                                    />
                                )
                            }}
                        </form.Field>
                        
                        <form.Field
                            name="uf"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="Estado"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(text) => field.handleChange(text.toUpperCase())}
                                        placeholder="UF"
                                        errors={field.state.meta.errors}
                                        required={true}
                                        maxLength={2}
                                    />
                                )
                            }}
                        </form.Field>
                    </div>

                    <div 
                        className="w-full flex flex-row items-start gap-x-5"
                    >
                        <form.Field
                            name="hotel"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="Hotel"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(text) => field.handleChange(text)}
                                        placeholder="Nome do hotel"
                                        errors={field.state.meta.errors}
                                        required={true}
                                        className="w-full"
                                    />
                                )
                            }}
                        </form.Field>
                    </div>

                    <div 
                        className="w-full flex flex-row items-start gap-x-5"
                    >
                        <form.Field
                            name="start_date"
                        >
                            {(field) => {
                                return (
                                    <DateInput
                                        id={field.name}
                                        label="Data de saída"
                                        type="datetime-local"
                                        value={field.state.value}
                                        onChange={(date) => field.handleChange(date)}
                                        required={true}
                                        min={new Date().toISOString().split('T')[0]}
                                        errors={field.state.meta.errors}
                                        className="w-full"
                                    />
                                )
                            }}
                        </form.Field>
                        
                        <form.Field
                            name="finish_date"
                        >
                            {(field) => {
                                return (
                                    <DateInput
                                        id={field.name}
                                        label="Data de retorno"
                                        type="datetime-local"
                                        value={field.state.value}
                                        onChange={(date) => field.handleChange(date)}
                                        required={true}
                                        min={new Date().toISOString().split('T')[0]}
                                        errors={field.state.meta.errors}
                                        className="w-full"
                                    />
                                )
                            }}
                        </form.Field>
                    </div>

                    <div 
                        className="w-full flex flex-row items-start gap-x-5"
                    >
                        <form.Field
                            name="expected_clients"
                        >
                            {(field) => {
                                return (
                                    <TextInput
                                        id={field.name}
                                        label="Número de clientes esperados"
                                        type="number"
                                        value={field.state.value ? String(field.state.value) : ""}
                                        onChange={(price) => field.handleChange(Number(price))}
                                        placeholder="Número de clientes"
                                        errors={field.state.meta.errors}
                                    />
                                )
                            }}
                        </form.Field>
                        
                        <form.Field
                            name="individual_price"
                        >
                            {(field) => {
                                return (
                                    <CurrencyInput
                                        id={field.name}
                                        label="Preço individual"
                                        value={field.state.value}
                                        onChange={(value: { floatValue: Updater<number>; }) => field.handleChange(value.floatValue)}
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
