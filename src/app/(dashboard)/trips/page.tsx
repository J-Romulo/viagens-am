"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/PageTitle";
import { getUserTrips } from "../../../services/queries/Trips";
import { Trip } from "../../../@types/Trip";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Trips() {
    const tripsQuery = useQuery<Trip[]>({
        queryKey: ['trips'],
        queryFn: getUserTrips,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (tripsQuery.isError) {
            toast.error("Ocorreu um erro ao tentar buscar as viagens. Tente novamente em instantes.");

        }
    }, [tripsQuery.isError]);

    if(tripsQuery.isLoading) {
        return (
            <div className="flex flex-col w-full h-full items-center bg-white shadow-lg rounded-lg p-3">
                <PageTitle title="Viagens" />
                <Loader
                    color={"#4f46e5"}
                    loading={true}
                    size={60}
                />
            </div>
        )
    }
    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg p-3 w-full h-full">
            <PageTitle title="Viagens" />
        </div>
    )
}