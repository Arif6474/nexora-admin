import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetBrandsQuery } from '../../redux/features/brands/brandApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import BrandActionsMenu from './components/brandActionsMenu';
import CreateBrand from './components/CreateBrand';
import ViewBrand from './components/ViewBrand';
import UpdateBrand from './components/UpdateBrand';
import Pagination from '@/components/Shared/Pagination/Pagination';

function Brands() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10, });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetBrandsQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'name', title: 'Brand Name' }),
        createColumn({ accessorKey: 'image', customCell: 'Image', image: true }),
        createColumn({ accessorKey: 'description', customCell: 'description' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Brands"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Brand"
                    isCreate
                    isBack
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
                    ItemActionsMenu={BrandActionsMenu}
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
                api={'brand/archiveBrand/'}
                singleItemApi={'brand/getSingleBrand/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Brand"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Brand"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateBrand}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewBrand}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateBrand}
            />
        </Layout>
    );
}

export default Brands;
