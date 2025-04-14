"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../../../components/PageTitle";
import { getTravelerById, updateTraveler } from "../../../../services/queries/Travelers";
import { Traveler } from "../../../../@types/Traveler";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";
import { Button } from "../../../../components/Button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { cpfMask, parseMaskedCPFToRaw } from "../../../../utils/masks";
import { isAxiosError } from "axios";

const travelerSchema = z.object({
  full_name: z.string()
    .min(1, "O campo nome é obrigatório."),
  
  birth_date: z.date().min(new Date("1900-01-01"), "A data de nascimento deve ser maior que 1900."),
  
  cpf: z.string()
    .min(1, "O campo CPF é obrigatório."),
  
  rg: z.string()
    .min(1, "O campo RG é obrigatório.")
});

export default function TravelerDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const [isEditing, setIsEditing] = useState(false);

  const travelerQuery = useQuery<Traveler>({
    queryKey: ['traveler', id],
    queryFn: () => getTravelerById(id),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (travelerQuery.isError) {
      toast.error("Ocorreu um erro ao tentar buscar as informações do viajante. Tente novamente em instantes.");
    }
  }, [travelerQuery.isError]);

  const form = useForm({
    defaultValues: {
      full_name: "",
      birth_date: new Date(),
      cpf: "",
      rg: "",
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onSubmit: travelerSchema,
    },
  });

  const updateTravelerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Traveler> }) => updateTraveler(id, data),
    onSuccess: () => {
      toast.success("Viajante atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ['traveler', id] });
      setIsEditing(false);
    },
    onError: (error) => {
      if(isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error("Ocorreu um erro ao atualizar o viajante. Tente novamente em instantes.");
    }
  });

  useEffect(() => {
    if (travelerQuery.data) {
      form.setFieldValue("full_name", travelerQuery.data.full_name);
      form.setFieldValue("birth_date", new Date(travelerQuery.data.birth_date));
      form.setFieldValue("cpf", travelerQuery.data.cpf);
      form.setFieldValue("rg", travelerQuery.data.rg);
    }
  }, [travelerQuery.data, form]);

  async function handleSubmit(data: Partial<Traveler>) {
      await updateTravelerMutation.mutateAsync({ id, data });
  }
        
  if(travelerQuery.isLoading || !travelerQuery.data) {
    return (
      <div className="flex flex-col w-full h-full items-center bg-white shadow-lg rounded-lg px-10 py-5">
          <PageTitle title="Detalhes do Viajante" />
          <Loader
              color={"#4f46e5"}
              loading={true}
              size={60}
              />
      </div>
    )
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
                  <PageTitle title="Detalhes do Viajante" />
              </div>
              {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-400 hover:text-primary-500 hover:underline transition"
                >
                    Editar
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700 hover:underline transition"
                  >
                      Cancelar
                  </button>
                  <form.Subscribe>
                    {({ canSubmit, isSubmitting }) => (
                      <Button 
                        type="submit"
                        disabled={!canSubmit}
                        size="small"
                        onClick={() => form.handleSubmit()}
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
              )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6 mx-auto w-2/3"
          >
            <div className="w-full flex flex-row items-top gap-x-5">
              <form.Field
                name="full_name"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="Nome"
                    type="text"
                    value={field.state.value}
                    onChange={(text) => field.handleChange(text)}
                    placeholder="Nome do viajante"
                    required={true}
                    className="w-lg"
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
              
              <form.Field
                name="birth_date"
              >
                {(field) => (
                  <DateInput
                    id={field.name}
                    label="Data de nascimento"
                    value={field.state.value}
                    onChange={(date) => field.handleChange(date)}
                    required={true}
                    disabled={!isEditing}
                  />
                )}
              </form.Field>
            </div>

            <div className="w-full flex flex-row items-center gap-x-5">
              <form.Field
                name="cpf"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="CPF"
                    type="text"
                    value={cpfMask(field.state.value)}
                    onChange={(text) => field.handleChange(parseMaskedCPFToRaw(text))}
                    placeholder="CPF"
                    required={true}
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
              
              <form.Field
                name="rg"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="RG"
                    type="text"
                    value={field.state.value}
                    onChange={(text) => field.handleChange(text)}
                    placeholder="RG"
                    required={true}
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
            </div>
          </form>
      </div>
  )
}