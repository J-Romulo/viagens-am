"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../../components/PageTitle";
import { getTripById } from "../../../../services/queries/Trips";
import { Trip } from "../../../../@types/Trip";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";
import { CurrencyInput } from "../../../../components/CurrencyInput";

export default function TripDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const tripQuery = useQuery<Trip>({
    queryKey: ['trip', id],
    queryFn: () => getTripById(id),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (tripQuery.isError) {
      toast.error("Ocorreu um erro ao tentar buscar as informações da viagem. Tente novamente em instantes.");
    }
  }, [tripQuery.isError]);
        
  if(tripQuery.isLoading || !tripQuery.data) {
    return (
      <div className="flex flex-col w-full h-full items-center bg-white shadow-lg rounded-lg px-10 py-5">
          <PageTitle title="Detalhes da Viagem" />
          <Loader
              color={"#4f46e5"}
              loading={true}
              size={60}
              />
      </div>
    )
  }

  const trip = tripQuery.data;

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
                  <PageTitle title="Detalhes da Viagem" />
              </div>
              <button
                  onClick={() => router.push(`/trips/${id}/edit`)}
                  className="text-primary-400 hover:text-primary-500 hover:underline transition"
              >
                  Editar
              </button>
          </div>

          <div className="space-y-6 mx-auto w-2/3">
              <div className="w-full flex flex-row items-top gap-x-5">
                  <TextInput
                      id="city"
                      label="Cidade"
                      type="text"
                      value={trip.city}
                      onChange={() => {}}
                      placeholder="Cidade da viagem"
                      required={true}
                      className="w-lg"
                      disabled
                  />
                  
                  <TextInput
                      id="uf"
                      label="Estado"
                      type="text"
                      value={trip.uf}
                      onChange={() => {}}
                      placeholder="UF"
                      required={true}
                      maxLength={2}
                      disabled
                  />
              </div>

              <div className="w-full flex flex-row items-center gap-x-5">
                  <TextInput
                      id="hotel"
                      label="Hotel"
                      type="text"
                      value={trip.hotel}
                      onChange={() => {}}
                      placeholder="Nome do hotel"
                      required={true}
                      className="w-full"
                      disabled
                  />
              </div>

              <div className="w-full flex flex-row items-center gap-x-5">
                  <DateInput
                      id="start_date"
                      label="Data de saída"
                      value={new Date(trip.start_date)}
                      onChange={() => {}}
                      required={true}
                      className="w-full"
                      disabled
                  />
                  
                  <DateInput
                      id="finish_date"
                      label="Data de retorno"
                      value={new Date(trip.finish_date)}
                      onChange={() => {}}
                      required={true}
                      className="w-full"
                      disabled
                  />
              </div>

              <div className="w-full flex flex-row items-center gap-x-5">
                  {trip.expected_clients && (
                      <TextInput
                          id="expected_clients"
                          label="Número de clientes esperados"
                          type="number"
                          value={String(trip.expected_clients)}
                          onChange={() => {}}
                          placeholder="Número de clientes"
                          disabled
                      />
                  )}

                  <CurrencyInput
                      id="individual_price"
                      label="Preço individual"
                      value={trip.individual_price}
                      onChange={() => {}}
                  />
              </div>

              {trip.clients && trip.clients.length > 0 && (
                  <div className="w-full">
                      <h3 className="text-lg font-semibold mb-4">Clientes</h3>
                      <div className="space-y-4">
                          {trip.clients.map((client) => (
                              <div key={client._id} className="border rounded-lg p-4">
                                  <p className="font-medium">{client.full_name}</p>
                                  <p className="text-sm text-gray-600">CPF: {client.cpf}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
  )
}
