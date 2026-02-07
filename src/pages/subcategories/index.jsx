import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetSubcategoriesQuery } from '../../redux/features/subcategories/subcategoryApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import SubcategoryActionsMenu from './components/subcategoryActionsMenu';
import CreateSubcategory from './components/CreateSubcategory';
import ViewSubcategory from './components/ViewSubcategory';
import UpdateSubcategory from './components/UpdateSubcategory';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { useParams } from 'react-router-dom';

function Subcategories() {
    const { id: categoryId } = useParams();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 15, category: categoryId });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    // Pass category query param to API
    const { data, isLoading, refetch } = useGetSubcategoriesQuery({
        search,
        filter,
        queryParams
    });

    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch, categoryId]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'name', title: 'Subcategory Name' }),
        // createColumn({ accessorKey: 'category.name', title: 'Parent Category' }), // Context implied by URL
        createColumn({ accessorKey: 'image', customCell: 'Image', image: true }),
        createColumn({ accessorKey: 'description', customCell: 'description' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Subcategories"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Subcategory"
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
                    ItemActionsMenu={SubcategoryActionsMenu}
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
                api={'subcategory/archiveSubcategory/'}
                singleItemApi={'subcategory/getSingleSubcategory/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Subcategory"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Subcategory"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateSubcategory}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewSubcategory}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateSubcategory}
                parentID={categoryId}
            />
        </Layout>
    );
}

export default Subcategories;
