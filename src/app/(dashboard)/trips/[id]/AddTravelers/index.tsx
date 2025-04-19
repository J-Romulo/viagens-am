import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserTravelers } from "../../../../../services/queries/Travelers";
import { Button } from "../../../../../components/Button";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import Loader from "react-spinners/ClipLoader";
import { CustomModal } from "../../../../../components/Modal";
import { Room } from "../../../../../@types/Trip";
import { Traveler } from "../../../../../@types/Traveler";
import { updateTripClients } from "../../../../../services/queries/Trips";

type RoomType = 'doubleCouple' | 'doubleSingle' | 'triple';

interface AddTravelersProps {
    tripId: string;
    currentRooms?: {
        doubleCouple: Room[],
        doubleSingle: Room[],
        triple: Room[]
    };
}

export function AddTravelers({ tripId, currentRooms }: AddTravelersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeRoomType, setActiveRoomType] = useState<RoomType>('doubleCouple');
    const [roomsData, setRoomsData] = useState<Record<RoomType, Room[]>>(currentRooms || {
        doubleCouple: [],
        doubleSingle: [],
        triple: []
    });
    const [showTravelerSelector, setShowTravelerSelector] = useState(false);
    const [currentEditingRoom, setCurrentEditingRoom] = useState<Room | null>(null);
    const queryClient = useQueryClient();

    // All travelers query
    const travelersQuery = useQuery({
        queryKey: ['travelers', tripId],
        queryFn: getUserTravelers,
        refetchOnWindowFocus: false
    });

    const updateTripClientsMutation = useMutation({
        mutationFn: ({ id, rooms }: { id: string, rooms: {
            doubleCouple: Room[],
            doubleSingle: Room[],
            triple: Room[]
        } }) => 
            updateTripClients(id, rooms),
        onSuccess: () => {
            toast.success("Viajantes atualizados com sucesso.");
            queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
            setIsOpen(false);
            setShowTravelerSelector(false)
            setCurrentEditingRoom(null)
        },
        onError: (error) => {
            console.log(error)
            if(isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }

            toast.error("Ocorreu um erro ao atualizar os viajantes. Tente novamente em instantes.");
        }
    });

    // Add a new room to the current room type
    const addNewRoom = () => {
        setRoomsData(prev => ({
            ...prev,
            [activeRoomType]: [
                ...prev[activeRoomType],
                { id: prev[activeRoomType].length + 1, travelers: [] }
            ]
        }));
    };

    // Open traveler selector for a specific room
    const openTravelerSelector = (room: Room) => {
        setCurrentEditingRoom(room);
        setShowTravelerSelector(true);
    };

    const isRoomFull = (room: Room) => {
        // Check max travelers per room type
        const maxTravelers = 
        activeRoomType === 'triple' ? 3 : 
        activeRoomType === 'doubleCouple' || activeRoomType === 'doubleSingle' ? 2 : 0;
        
        if (room.travelers.length >= maxTravelers) {
            return true
        }

        return false
    }

    // Add or remove traveler from the current editing room
    const handleTravelerSelect = (client: Traveler) => {
        if (!currentEditingRoom) return;

        setRoomsData(prev => {
            const roomIndex = prev[activeRoomType].findIndex(
                r => r.id === currentEditingRoom.id
            );
            
            if (roomIndex === -1) return prev;
            
            const room = prev[activeRoomType][roomIndex];
            let updatedTravelers: Traveler[];
            
            // Check if traveler is already in room
            const travelerIndex = room.travelers.findIndex(t => t._id === client._id);
            
            if (travelerIndex >= 0) {
                // Remove traveler if already in room
                updatedTravelers = room.travelers.filter(t => t._id !== client._id);
            } else {
                if(isRoomFull(room)) return prev
                
                // Add traveler to room
                updatedTravelers = [...room.travelers, client];
            }
            
            // Create updated room
            const updatedRoom = { ...room, travelers: updatedTravelers };
            
            // Update rooms array
            const updatedRooms = [...prev[activeRoomType]];
            updatedRooms[roomIndex] = updatedRoom;
            
            setCurrentEditingRoom(updatedRoom)
            return {
                ...prev,
                [activeRoomType]: updatedRooms
            };
        });
    };

    // Remove a room
    const removeRoom = (roomId: string) => {
        setRoomsData(prev => ({
            ...prev,
            [activeRoomType]: [ ...prev[activeRoomType].filter(r => r.id !== roomId) ]
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        await updateTripClientsMutation.mutateAsync({
            id: tripId,
            rooms: roomsData
        });
    };

    // Check if a traveler is already assigned to any room
    const isTravelerAssigned = useCallback( (travelerId: string): boolean => {
        let isTravelerAssigned = false
        Object.values(roomsData).forEach((rooms) => {
            rooms.forEach((room) => {
                if (room.travelers.some(t => t._id === travelerId)) {
                    isTravelerAssigned = true
                }
            })
        })

        return isTravelerAssigned;
    }, [roomsData]);

    // Get room type display name
    const getRoomTypeDisplayName = (type: RoomType): string => {
        switch (type) {
            case 'doubleCouple': return 'Quarto Duplo (Casal)';
            case 'doubleSingle': return 'Quarto Duplo (Solteiro)';
            case 'triple': return 'Quarto Triplo';
            default: return '';
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-primary-400 hover:text-primary-500 hover:underline transition"
            >
                Atualizar viajantes
            </button>
            <CustomModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                headerTitle="Atualizar lista de viajantes por quarto"
            >
                {travelersQuery.isLoading ? (
                    <div className="flex justify-center p-10">
                        <Loader color="#4f46e5" loading={true} size={40} />
                    </div>
                ) : travelersQuery.isError ? (
                    <div className="text-red-500 text-center p-10">
                        Ocorreu um erro ao carregar os clientes. Tente novamente em instantes.
                    </div>
                ) : (
                    <div className="flex w-200 h-100">
                        {/* Left Navigation */}
                        <div className="w-1/3 border-r border-gray-200 py-4">
                            <nav className="space-y-1">
                                {(['doubleCouple', 'doubleSingle', 'triple'] as RoomType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {setCurrentEditingRoom(null); setShowTravelerSelector(false); setActiveRoomType(type)}}
                                        className={`w-full text-left px-4 py-3 flex justify-between items-center ${
                                            activeRoomType === type
                                                ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{getRoomTypeDisplayName(type)}</span>
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                            {roomsData[type].length}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Right Content Area */}
                        <div className="p-6 pb-2 overflow-hidden flex flex-col w-full">
                            {!showTravelerSelector ? (
                                // Room List View
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {getRoomTypeDisplayName(activeRoomType)}
                                        </h3>
                                        <button
                                            onClick={addNewRoom}
                                            className="text-primary-400 hover:text-primary-500 hover:underline transition"
                                        >
                                            Novo Quarto
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-4">
                                        {roomsData[activeRoomType].length === 0 ? (
                                            <div className="text-center p-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                                Nenhum quarto adicionado.
                                                <p className="mt-2">
                                                    <button
                                                        onClick={addNewRoom}
                                                        className="text-primary-500 hover:underline"
                                                    >
                                                        Adicionar quarto
                                                    </button>
                                                </p>
                                            </div>
                                        ) : (
                                            roomsData[activeRoomType].map((room) => (
                                                <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-medium text-gray-700">
                                                            Quarto #{room.id}
                                                        </h4>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openTravelerSelector(room)}
                                                                className="text-primary-500 hover:text-primary-600 text-sm"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => removeRoom(room.id)}
                                                                className="text-red-500 hover:text-red-600 text-sm"
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {room.travelers.length === 0 ? (
                                                        <div className="text-gray-500 text-sm py-2">
                                                            Nenhum viajante adicionado
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {room.travelers.map(traveler => (
                                                                <div key={traveler._id} className="bg-gray-50 p-2 rounded text-sm">
                                                                    <p className="font-medium">{traveler.full_name}</p>
                                                                    <p className="text-xs text-gray-500">CPF: {traveler.cpf}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            ) : (
                                // Traveler Selector View
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Selecionar Viajantes para Quarto #{currentEditingRoom?.id}
                                        </h3>
                                        <Button
                                            onClick={() => setShowTravelerSelector(false)}
                                            size="small"
                                            className="bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                        >
                                            Voltar
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-2">
                                        {travelersQuery.data?.map((client) => {
                                            const isInCurrentRoom = currentEditingRoom?.travelers.some(t => t._id === client._id);
                                            const isAssignedElsewhere = !isInCurrentRoom && isTravelerAssigned(client._id);

                                            return (
                                                <div
                                                    key={client._id}
                                                    className={`p-3 rounded-lg border transition ${
                                                        isAssignedElsewhere || (isRoomFull(currentEditingRoom!) && !isInCurrentRoom)
                                                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                            : isInCurrentRoom
                                                            ? 'border-primary-500 bg-primary-50 cursor-pointer'
                                                            : 'border-gray-200 hover:border-primary-300 cursor-pointer'
                                                    }`}
                                                    onClick={() => !isAssignedElsewhere && handleTravelerSelect(client)}
                                                >
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="font-medium text-primary-500">{client.full_name}</p>
                                                            <p className="text-sm text-gray-600">CPF: {client.cpf}</p>
                                                        </div>
                                                        {isAssignedElsewhere && (
                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full self-start">
                                                                Já alocado
                                                            </span>
                                                        )}

                                                        {isRoomFull(currentEditingRoom!) && !isInCurrentRoom && (
                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full self-start">
                                                                Quarto lotado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* Footer Actions */}
                            <div className="pt-4 mt-4 border-t border-gray-200 flex justify-end">
                                <div className="flex gap-4 mt-4">
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
                        </div>
                    </div>
                )}
            </CustomModal>
        </>
    );
}
