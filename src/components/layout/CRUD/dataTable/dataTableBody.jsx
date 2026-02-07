import {
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'

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
                    <TableRow key={index} className="animate-pulse">
                        {columns.map((_, colIndex) => (
                            <TableCell key={colIndex} className="p-2">
                                {/* Skeleton cell */}
                                <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </TableCell>
                        ))}
                        {/* Skeleton for actions column */}
                        <TableCell className="p-2">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
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
