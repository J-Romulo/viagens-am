import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
export interface TableProps<T> {
	data?: T[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
}

export function Table<T>(props: TableProps<T>) {
    const {
		data,
		columns
	} = props;

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    
    return (
        <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-primary-500 text-white">
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                    <th 
                        key={header.id} 
                        className="py-3 px-4 text-left font-medium border-b border-primary-600"
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
                {table.getRowModel().rows.map((row, index) => (
                <tr 
                    key={row.id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}
                >
                    {row.getVisibleCells().map(cell => (
                    <td 
                        key={cell.id} 
                        className={`py-3 px-4 border-b border-neutral-300 text-neutral-500 w-${cell.column.columnDef.size}`}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    )
}