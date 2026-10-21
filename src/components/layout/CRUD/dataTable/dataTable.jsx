import { useState } from 'react'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    Table,

} from '@/components/ui/table'
import DataTableHeader from './dataTableHeader'
import { DataTablePagination } from './dataTablePagination'
import DataTableBody from './dataTableBody'
import NotFound from '@/components/Shared/NotFound/NotFound'
import TableSkeleton from '@/components/Shared/TableSkeleton/TableSkeleton'

export function DataTable({
    columns, data = [], filter,
    setTargetID, setShowArchiveModal, setShowModal, setShowItem, setShowUpdateForm,
    ItemActionsMenu, isLoading

}) {
    if (isLoading) {
        return <TableSkeleton columns={columns} rows={8} showPagination={false} />
    }

    if (!data || data.length === 0) return <NotFound />

    const [sorting, setSorting] = useState([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),

    })

    return (
        <>
            {
                data?.length > 0 &&
                <div className='-mx-4  flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 data-table'>
                    <div className='space-y-4'>
                        <div className='rounded-xl border border-stone-200/90 dark:border-[#1e2330] bg-white dark:bg-[#11141b] text-stone-900 dark:text-stone-100 shadow-sm overflow-hidden'>
                            <Table>
                                <DataTableHeader table={table} />
                                <DataTableBody
                                    table={table}
                                    columns={columns}
                                    setTargetID={setTargetID}
                                    setShowArchiveModal={setShowArchiveModal}
                                    setShowModal={setShowModal}
                                    setShowItem={setShowItem}
                                    setShowUpdateForm={setShowUpdateForm}
                                    ItemActionsMenu={ItemActionsMenu}
                                    filter={filter}
                                    isLoading={isLoading}
                                />
                            </Table>
                        </div>
                        {/* <DataTablePagination table={table} /> */}
                    </div>
                </div>
            }
        </>
    )
}
