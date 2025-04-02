"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/PageTitle";
import { getUserTrips } from "../../../services/queries/Trips";
import { Trip } from "../../../@types/Trip";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../../../components/Table";

const columnHelper = createColumnHelper<Trip>()

const columns = [
  columnHelper.accessor('city', {
    header: "Cidade",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('uf', {
    header: "Estado",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hotel', {
    header: "Hotel",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('start_date', {
    header: "Ida",
    cell: (info) => Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    })
      .format(new Date(info.getValue()))
      .replace(',', ' às'),
  }),
  columnHelper.accessor('finish_date', {
    header: "Volta",
    cell: (info) => Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    })
      .format(new Date(info.getValue()))
      .replace(',', ' às'),
  }),
]

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

          <Table 
            data={tripsQuery.data}
            columns={columns}
          />
      </div>
  )
}