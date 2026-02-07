import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetColorsQuery } from '../../redux/features/colors/colorApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import ColorActionsMenu from './components/colorActionsMenu';
import CreateColor from './components/CreateColor';
import ViewColor from './components/ViewColor';
import UpdateColor from './components/UpdateColor';
import Pagination from '@/components/Shared/Pagination/Pagination';

function Colors() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10 });

    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetColorsQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'name', title: 'Color Name' }),
        {
            accessorKey: 'hexCode',
            header: 'Preview',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full border border-stone-800"
                        style={{ backgroundColor: row.original.hexCode }}
                    />
                    <span className="font-mono text-xs uppercase text-stone-400">{row.original.hexCode}</span>
                </div>
            )
        },
        createColumn({ accessorKey: 'isActive', customCell: 'status', title: 'Status' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Master Colors"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Add Master Color"
                    isCreate
                />
                <SearchFilterSelect
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    filterData={filterData}
                    refetch={refetch}
                />
                <DataTable
                    data={documents}
                    columns={columns}
                    setTargetID={setTargetID}
                    setShowArchiveModal={setShowArchiveModal}
                    setShowUpdateForm={setShowUpdateForm}
                    setShowItem={setShowItem}
                    ItemActionsMenu={ColorActionsMenu}
                />
                <Pagination
                    totalPages={totalPages}
                    items={documents}
                    totalItems={totalItems}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                />
            </ScreenWrapper>
            <ArchiveItem
                api={'color/archiveColor/'}
                singleItemApi={'color/getSingleColor/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Color"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Master Color"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateColor}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewColor}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateColor}
            />
        </Layout>
    );
}

export default Colors;
