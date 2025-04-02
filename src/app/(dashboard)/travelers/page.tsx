"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/PageTitle";
import Loader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../../../components/Table";
import { Traveler } from "../../../@types/Traveler";
import { getUserTravelers } from "../../../services/queries/Travelers";

const columnHelper = createColumnHelper<Traveler>()

const columns = [
  columnHelper.accessor('full_name', {
    header: "Nome",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('cpf', {
    header: "CPF",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('rg', {
    header: "RG",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('birth_date', {
    header: "Ida",
    cell: (info) => Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
      .format(new Date(info.getValue())),
  }),
]

export default function Travelers() {
  const travelersQuery = useQuery<Traveler[]>({
    queryKey: ['travelers'],
    queryFn: getUserTravelers,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (travelersQuery.isError) {
      toast.error("Ocorreu um erro ao tentar buscar seus viajantes. Tente novamente em instantes.");
    }
  }, [travelersQuery.isError]);
        
  if(travelersQuery.isLoading) {
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
            data={travelersQuery.data}
            columns={columns}
          />
      </div>
  )
}