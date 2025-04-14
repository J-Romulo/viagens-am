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
import { Button } from "../../../components/Button";
import { useRouter } from "next/navigation";
import { IoIosCreate } from "react-icons/io";

const columnHelper = createColumnHelper<Traveler>()

export default function Travelers() {
  const router = useRouter();
  
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
      <div className="flex flex-col w-full h-full items-center bg-white shadow-lg rounded-lg px-10 py-5">
          <PageTitle title="Viajantes" />
          <Loader
              color={"#4f46e5"}
              loading={true}
              size={60}
              />
      </div>
    )
  }

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
      header: "Data de Nascimento",
      cell: (info) => Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
        .format(new Date(info.getValue())),
    }),
    columnHelper.display({
      id: 'actions',
      header: "Ações",
      size: 30,
      cell: ({ row }) => (
        <Button
          onClick={() => {
            router.push(`/travelers/${row.original._id}`);
          }}
          size="small"
          className="flex items-center justify-center rounded-full"
        >
          <IoIosCreate size={16} />
        </Button>
      ),
    }),
  ]

  return (
      <div className="flex flex-col bg-white shadow-lg rounded-lg px-10 py-5 w-full h-full">
          <PageTitle title="Viajantes" />

          <Table 
            data={travelersQuery.data}
            columns={columns}
          />

          <Button
            onClick={() => {
              router.push('/travelers/create');
            }}
            size="small"
            className="mt-8"
          >
            Adicionar viajante
          </Button>
      </div>
  )
}