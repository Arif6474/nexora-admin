import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetSizesQuery } from '../../redux/features/sizes/sizeApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import SizeActionsMenu from './components/sizeActionsMenu';
import CreateSize from './components/CreateSize';
import ViewSize from './components/ViewSize';
import UpdateSize from './components/UpdateSize';
import Pagination from '@/components/Shared/Pagination/Pagination';

function Sizes() {
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

    const { data, isLoading, refetch } = useGetSizesQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'size', title: 'Size' }),
        createColumn({ accessorKey: 'itemType', title: 'Type' }),
        createColumn({ accessorKey: 'gender', title: 'Gender' }),
        createColumn({ accessorKey: 'serial', title: 'Serial', customCell: 'serial' }),
        createColumn({ accessorKey: 'isActive', customCell: 'status', title: 'Status' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Master Sizes"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Add Master Size"
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
                    ItemActionsMenu={SizeActionsMenu}
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
                api={'size/archiveSize/'}
                singleItemApi={'size/getSingleSize/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Size"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Master Size"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateSize}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewSize}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateSize}
            />
        </Layout>
    );
}

export default Sizes;
