import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EmptyContent } from '../EmptyContent';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface TableProps<T> {
  data?: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
}

export function Table<T>(props: TableProps<T>) {
  const { data, columns } = props;

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ShadcnTable className='w-full overflow-hidden rounded-lg'>
      <TableHeader className='bg-primary-500 text-white'>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className='hover:bg-primary-500'>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className='border-primary-600 border-b px-4 py-3 text-left font-medium text-white'
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {data?.length ? (
          table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className='border-b border-neutral-300 px-4 py-3 text-neutral-500'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className='h-32 hover:bg-transparent'>
            <TableCell
              colSpan={columns.length}
              className='text-center text-neutral-500'
            >
              <EmptyContent />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </ShadcnTable>
  );
}
