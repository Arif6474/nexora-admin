import {
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'

function DataTableBody({
    table, columns, filter,
    setTargetID, setShowArchiveModal, setShowModal, setShowItem, setShowUpdateForm,
    ItemActionsMenu,isLoading
}) {


    // Skeleton loading structure (number of skeleton rows to display while loading)
    const skeletonRows = 10;

    return (
        <TableBody>
            {isLoading ? (
                // Skeleton loader (5 rows)
                Array.from({ length: skeletonRows }).map((_, index) => (
                    <TableRow key={index} className="transition-colors">
                        {columns.map((_, colIndex) => (
                            <TableCell key={colIndex} className="p-4">
                                <Skeleton className="w-full h-5 rounded-md" />
                            </TableCell>
                        ))}
                        <TableCell className="p-4 text-right">
                            <Skeleton className="w-7 h-7 rounded-lg ml-auto" />
                        </TableCell>
                    </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
                // Render actual rows when data is fetched
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-4" setTargetID={setTargetID}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        <ItemActionsMenu
                            row={row}
                            filter={filter}
                            setTargetID={setTargetID}
                            setShowArchiveModal={setShowArchiveModal}
                            setShowModal={setShowModal}
                            setShowItem={setShowItem}
                            setShowUpdateForm={setShowUpdateForm}
                        />
                    </TableRow>
                ))
            ) : (
                // No results
                <TableRow>
                    <TableCell colSpan={columns?.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}

export default DataTableBody;
