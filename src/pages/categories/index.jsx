import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetCategoriesQuery } from '../../redux/features/categories/categoryApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import CategoryActionsMenu from './components/categoryActionsMenu';
import CreateCategory from './components/CreateCategory';
import ViewCategory from './components/ViewCategory';
import UpdateCategory from './components/UpdateCategory';
import Pagination from '@/components/Shared/Pagination/Pagination';

function Categories() {
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

    const { data, isLoading, refetch } = useGetCategoriesQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'name', title: 'Category Name' }),
        createColumn({ accessorKey: 'image', customCell: 'Image', image: true }),
        createColumn({ accessorKey: 'description', customCell: 'description' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Categories"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Category"
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
                    ItemActionsMenu={CategoryActionsMenu}
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
                api={'category/archiveCategory/'}
                singleItemApi={'category/getSingleCategory/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Category"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Category"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateCategory}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewCategory}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateCategory}
            />
        </Layout>
    );
}

export default Categories;
