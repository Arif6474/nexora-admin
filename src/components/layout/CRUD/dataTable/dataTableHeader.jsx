import {
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
function DataTableHeader({ table }) {
    return (
        <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan} style={{ padding: '0.5rem 0.9rem' }}>
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
    )
}

export default DataTableHeader