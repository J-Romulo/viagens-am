"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../../components/PageTitle";
import { getTravelerById } from "../../../../services/queries/Travelers";
import { Traveler } from "../../../../@types/Traveler";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";

export default function TravelerDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

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

  const traveler = travelerQuery.data;

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
              <button
                  onClick={() => router.push(`/travelers/${id}/edit`)}
                  className="text-primary-400 hover:text-primary-500 hover:underline transition"
              >
                  Editar
              </button>
          </div>

          <div className="space-y-6 mx-auto w-2/3">
              <div className="w-full flex flex-row items-top gap-x-5">
                  <TextInput
                      id="full_name"
                      label="Nome"
                      type="text"
                      value={traveler.full_name}
                      onChange={() => {}}
                      placeholder="Nome do viajante"
                      required={true}
                      className="w-lg"
                      disabled
                  />
                  
                  <DateInput
                      id="birth_date"
                      label="Data de nascimento"
                      value={new Date(traveler.birth_date)}
                      onChange={() => {}}
                      required={true}
                      disabled
                  />
              </div>

              <div className="w-full flex flex-row items-center gap-x-5">
                  <TextInput
                      id="cpf"
                      label="CPF"
                      type="text"
                      value={traveler.cpf}
                      onChange={() => {}}
                      placeholder="CPF"
                      required={true}
                      disabled
                  />
                  
                  <TextInput
                      id="rg"
                      label="RG"
                      type="text"
                      value={traveler.rg}
                      onChange={() => {}}
                      placeholder="RG"
                      required={true}
                      disabled
                  />
              </div>

              {traveler.email && (
                  <TextInput
                      id="email"
                      label="Email"
                      type="email"
                      value={traveler.email}
                      onChange={() => {}}
                      placeholder="Email"
                      disabled
                  />
              )}

              {traveler.phone && (
                  <TextInput
                      id="phone"
                      label="Telefone"
                      type="tel"
                      value={traveler.phone}
                      onChange={() => {}}
                      placeholder="Telefone"
                      disabled
                  />
              )}
          </div>
      </div>
  )
}
