"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../../../components/PageTitle";
import { getTripById, updateTrip } from "../../../../services/queries/Trips";
import { Trip } from "../../../../@types/Trip";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { TextInput } from "../../../../components/TextInput";
import { DateInput } from "../../../../components/DateInput";
import { CurrencyInput } from "../../../../components/CurrencyInput";
import { Button } from "../../../../components/Button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { isAxiosError } from "axios";
import { AddTravelers } from "./AddTravelers";
import { IoPerson } from "react-icons/io5";
import { IoMdBed } from "react-icons/io";
import { ClientsReport } from "./ClientsReport";

const tripSchema = z.object({
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

// Room type definitions
type RoomType = 'doubleCouple' | 'doubleSingle' | 'triple';

export default function TripDetails({ params }: { params: Promise<{ id: string }> }) {
  const { generatePDF } = ClientsReport()
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const [isEditing, setIsEditing] = useState(false);

  const tripQuery = useQuery<Trip>({
    queryKey: ['trip', id],
    queryFn: () => getTripById(id),
    refetchOnWindowFocus: false
  });

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
      onSubmit: tripSchema,
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Trip> }) => updateTrip(id, data),
    onSuccess: () => {
      toast.success("Viagem atualizada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      setIsEditing(false);
    },
    onError: (error) => {
      if(isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error("Ocorreu um erro ao atualizar a viagem. Tente novamente em instantes.");
    }
  });

  useEffect(() => {
    if (tripQuery.isError) {
      toast.error("Ocorreu um erro ao tentar buscar as informações da viagem. Tente novamente em instantes.");
    }
  }, [tripQuery.isError]);

  useEffect(() => {
    if (tripQuery.data) {
      form.setFieldValue("city", tripQuery.data.city);
      form.setFieldValue("uf", tripQuery.data.uf);
      form.setFieldValue("hotel", tripQuery.data.hotel);
      form.setFieldValue("start_date", new Date(tripQuery.data.start_date));
      form.setFieldValue("finish_date", new Date(tripQuery.data.finish_date));
      form.setFieldValue("individual_price", tripQuery.data.individual_price);
      form.setFieldValue("expected_clients", tripQuery.data.expected_clients || 0);
    }
  }, [tripQuery.data, form]);

  async function handleSubmit(data: Partial<Trip>) {
    await updateTripMutation.mutateAsync({ id, data });
  }

  // Get room type display name
  const getRoomTypeDisplayName = (type: RoomType): string => {
    switch (type) {
      case 'doubleCouple': return 'Quarto Duplo (Casal)';
      case 'doubleSingle': return 'Quarto Duplo (Solteiro)';
      case 'triple': return 'Quarto Triplo';
      default: return '';
    }
  };

  // Count total travelers
  const getTotalTravelers = () => {
    if (!tripQuery.data?.rooms) return 0;
    let count = 0;
    
    Object.values(tripQuery.data.rooms).forEach(roomArray => {
      if (Array.isArray(roomArray)) {
        roomArray.forEach(room => {
          if (room.travelers && Array.isArray(room.travelers)) {
            count += room.travelers.length;
          }
        });
      }
    });
    
    return count;
  };
        
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

  return (
      <div className="flex flex-col bg-white shadow-lg rounded-lg px-10 py-5 pb-15 w-full h-full overflow-y-auto">
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
                name="city"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="Cidade"
                    type="text"
                    value={field.state.value}
                    onChange={(text) => field.handleChange(text)}
                    placeholder="Cidade da viagem"
                    required={true}
                    className="w-lg"
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
              
              <form.Field
                name="uf"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="Estado"
                    type="text"
                    value={field.state.value}
                    onChange={(text) => field.handleChange(text)}
                    placeholder="UF"
                    required={true}
                    maxLength={2}
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
            </div>

            <div className="w-full flex flex-row items-center gap-x-5">
              <form.Field
                name="hotel"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="Hotel"
                    type="text"
                    value={field.state.value}
                    onChange={(text) => field.handleChange(text)}
                    placeholder="Nome do hotel"
                    required={true}
                    className="w-full"
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>
            </div>

            <div className="w-full flex flex-row items-center gap-x-5">
              <form.Field
                name="start_date"
              >
                {(field) => (
                  <DateInput
                    id={field.name}
                    label="Data de saída"
                    value={field.state.value}
                    onChange={(date) => field.handleChange(date)}
                    required={true}
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                    className="w-full"
                  />
                )}
              </form.Field>
              
              <form.Field
                name="finish_date"
              >
                {(field) => (
                  <DateInput
                    id={field.name}
                    label="Data de retorno"
                    value={field.state.value}
                    onChange={(date) => field.handleChange(date)}
                    required={true}
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                    className="w-full"
                  />
                )}
              </form.Field>
            </div>

            <div className="w-full flex flex-row items-center gap-x-5">
              <form.Field
                name="expected_clients"
              >
                {(field) => (
                  <TextInput
                    id={field.name}
                    label="Número de clientes esperados"
                    type="number"
                    value={String(field.state.value)}
                    onChange={(value) => field.handleChange(Number(value))}
                    placeholder="Número de clientes"
                    disabled={!isEditing}
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>

              <form.Field
                name="individual_price"
              >
                {(field) => (
                  <CurrencyInput
                    id={field.name}
                    label="Preço individual"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value.floatValue)}
                    disabled={!isEditing}
                  />
                )}
              </form.Field>
            </div>
          </form>

          {/* Simple Rooms Section */}
          <div className="w-full mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-primary-500 font-semibold">
                Viajantes ({getTotalTravelers()})
              </h3>
              <div className="flex align-center gap-x-3">
                <AddTravelers 
                  tripId={id}
                  currentRooms={tripQuery.data.rooms}
                />
                <button
                  onClick={() => generatePDF(tripQuery.data)}
                  className="text-primary-400 hover:text-primary-500 hover:underline transition"
                >
                  Gerar relatório de clientes
                </button>
              </div>
            </div>

            {/* Room Types */}
            <div className="space-y-8 mb-10">
              {/* Double Couple Rooms */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    {getRoomTypeDisplayName('doubleCouple')} ({tripQuery.data.rooms?.doubleCouple?.length || 0})
                  </h4>
                </div>
                
                <div className="p-4 space-y-4">
                  {!tripQuery.data.rooms?.doubleCouple || tripQuery.data.rooms.doubleCouple.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                      Nenhum quarto deste tipo adicionado.
                    </div>
                  ) : (
                    tripQuery.data.rooms.doubleCouple.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between">
                          <div className="flex items-center">
                            <IoMdBed className="text-primary-500 mr-2" size={18} />
                            <span className="font-medium">Quarto #{room.id}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {room.travelers?.length || 0} {(room.travelers?.length || 0) === 1 ? 'viajante' : 'viajantes'}
                          </span>
                        </div>
                        
                        {!room.travelers || room.travelers.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">
                            Nenhum viajante adicionado
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {room.travelers.map((traveler) => (
                              <div key={traveler._id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                  <p className="font-medium text-primary-500">{traveler.full_name}</p>
                                  <p className="text-sm text-gray-600">CPF: {traveler.cpf}</p>
                                </div>
                                <button
                                  onClick={() => router.push(`/travelers/${traveler._id}`)}
                                  className="text-primary-400 hover:text-primary-500 transition p-1 rounded-full hover:bg-gray-100"
                                  title="Ver detalhes do viajante"
                                >
                                  <IoPerson size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Double Single Rooms */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    {getRoomTypeDisplayName('doubleSingle')} ({tripQuery.data.rooms?.doubleSingle?.length || 0})
                  </h4>
                </div>
                
                <div className="p-4 space-y-4">
                  {!tripQuery.data.rooms?.doubleSingle || tripQuery.data.rooms.doubleSingle.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                      Nenhum quarto deste tipo adicionado.
                    </div>
                  ) : (
                    tripQuery.data.rooms.doubleSingle.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between">
                          <div className="flex items-center">
                            <IoMdBed className="text-primary-500 mr-2" size={18} />
                            <span className="font-medium">Quarto #{room.id}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {room.travelers?.length || 0} {(room.travelers?.length || 0) === 1 ? 'viajante' : 'viajantes'}
                          </span>
                        </div>
                        
                        {!room.travelers || room.travelers.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">
                            Nenhum viajante adicionado
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {room.travelers.map((traveler) => (
                              <div key={traveler._id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                  <p className="font-medium text-primary-500">{traveler.full_name}</p>
                                  <p className="text-sm text-gray-600">CPF: {traveler.cpf}</p>
                                </div>
                                <button
                                  onClick={() => router.push(`/travelers/${traveler._id}`)}
                                  className="text-primary-400 hover:text-primary-500 transition p-1 rounded-full hover:bg-gray-100"
                                  title="Ver detalhes do viajante"
                                >
                                  <IoPerson size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Triple Rooms */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    {getRoomTypeDisplayName('triple')} ({tripQuery.data.rooms?.triple?.length || 0})
                  </h4>
                </div>
                
                <div className="p-4 space-y-4">
                  {!tripQuery.data.rooms?.triple || tripQuery.data.rooms.triple.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                      Nenhum quarto deste tipo adicionado.
                    </div>
                  ) : (
                    tripQuery.data.rooms.triple.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between">
                          <div className="flex items-center">
                            <IoMdBed className="text-primary-500 mr-2" size={18} />
                            <span className="font-medium">Quarto #{room.id}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {room.travelers?.length || 0} {(room.travelers?.length || 0) === 1 ? 'viajante' : 'viajantes'}
                          </span>
                        </div>
                        
                        {!room.travelers || room.travelers.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">
                            Nenhum viajante adicionado
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {room.travelers.map((traveler) => (
                              <div key={traveler._id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                  <p className="font-medium text-primary-500">{traveler.full_name}</p>
                                  <p className="text-sm text-gray-600">CPF: {traveler.cpf}</p>
                                </div>
                                <button
                                  onClick={() => router.push(`/travelers/${traveler._id}`)}
                                  className="text-primary-400 hover:text-primary-500 transition p-1 rounded-full hover:bg-gray-100"
                                  title="Ver detalhes do viajante"
                                >
                                  <IoPerson size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
  )
}