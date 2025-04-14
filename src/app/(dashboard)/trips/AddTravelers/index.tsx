import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserTravelers } from "../../../../services/queries/Travelers";
import { updateTripClients } from "../../../../services/queries/Trips";
import { Button } from "../../../../components/Button";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import Loader from "react-spinners/ClipLoader";
import { CustomModal } from "../../../../components/Modal";

interface Client {
    _id: string;
    full_name: string;
    cpf: string;
}

interface AddTravelersProps {
    tripId: string;
    currentClients?: Client[];
}

export function AddTravelers({ tripId, currentClients = [] }: AddTravelersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState<Client[]>(currentClients);
    const queryClient = useQueryClient();

    const travelersQuery = useQuery({
        queryKey: ['travelers'],
        queryFn: getUserTravelers,
        refetchOnWindowFocus: false
    });

    const updateTripClientsMutation = useMutation({
        mutationFn: ({ id, clients }: { id: string, clients: string[] }) => 
            updateTripClients(id, clients),
        onSuccess: () => {
            toast.success("Clientes adicionados com sucesso.");
            queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
            setIsOpen(false);
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }

            toast.error("Ocorreu um erro ao adicionar os clientes. Tente novamente em instantes.");
        }
    });

    const handleClientSelect = (client: Client) => {
        setSelectedClients(prev => {
            const isSelected = prev.some(c => c._id === client._id);
            if (isSelected) {
                return prev.filter(c => c._id !== client._id);
            }
            return [...prev, client];
        });
    };

    const handleSubmit = async () => {
        await updateTripClientsMutation.mutateAsync({
            id: tripId,
            clients: selectedClients.map(client => client._id)
        });
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                size="small"
                type="button"
            >
                Adicionar viajantes
            </Button>
            <CustomModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                headerTitle="Adicionar Clientes"
            >
                <div className="flex flex-col gap-4">
                    {travelersQuery.isLoading ? (
                        <div className="flex justify-center">
                            <Loader color="#4f46e5" loading={true} size={40} />
                        </div>
                    ) : travelersQuery.isError ? (
                        <div className="text-red-500 text-center">
                            Ocorreu um erro ao carregar os clientes. Tente novamente em instantes.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="max-h-96 overflow-y-auto">
                                {travelersQuery.data?.map((client) => (
                                    <div
                                        key={client._id}
                                        className={`p-4 border rounded-lg cursor-pointer ${
                                            selectedClients.some(c => c._id === client._id)
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                        onClick={() => handleClientSelect(client)}
                                    >
                                        <div className="font-medium">{client.full_name}</div>
                                        <div className="text-sm text-gray-500">{client.cpf}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    size="small"
                                    className="border border-gray-300 hover:border-gray-400"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    size="small"
                                    disabled={updateTripClientsMutation.isPending}
                                >
                                    {updateTripClientsMutation.isPending ? (
                                        <Loader color="#FFF" loading={true} size={20} />
                                    ) : (
                                        'Salvar'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CustomModal>
        </>
    );
}

