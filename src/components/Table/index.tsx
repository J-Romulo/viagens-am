import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EmptyContent } from '../EmptyContent';

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
    <table className='w-full border-collapse overflow-hidden rounded-lg'>
      <thead className='bg-primary-500 text-white'>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className='border-primary-600 border-b px-4 py-3 text-left font-medium'
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {data?.length ? (
          table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`border-b border-neutral-300 px-4 py-3 text-neutral-500 w-${cell.column.columnDef.size}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr className='h-32'>
            <td
              colSpan={columns.length}
              className='text-center text-neutral-500'
            >
              <EmptyContent />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
