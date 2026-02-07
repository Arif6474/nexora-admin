import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetProductsQuery } from '../../redux/features/products/productApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import ProductActionsMenu from './components/productActionsMenu';
import CreateProduct from './components/CreateProduct';
import ViewProduct from './components/ViewProduct';
import UpdateProduct from './components/UpdateProduct';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { useGetCategoriesQuery } from '../../redux/features/categories/categoryApi';

function Products() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');

    const [category, setCategory] = useState("");

    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10 });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();


    const { data: categories, } = useGetCategoriesQuery({ queryParams: { currentPage: 1, limit: 200, } });

    const { data, isLoading, refetch } = useGetProductsQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
        if (category) {
            setQueryParams((prev) => ({
                ...prev,
                category: category
            }));
        }
    }, [filter, refetch, category]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'sku', title: 'Product SKU' }),
        createColumn({ accessorKey: 'title', title: 'Product Title' }),
        createColumn({ accessorKey: 'image', customCell: 'Image', image: true }),
        createColumn({ accessorKey: 'price', customCell: 'price' }),
        createColumn({ accessorKey: 'quantity', customCell: 'quantity' }),
    ];

    const selectData = {
        label: "Categories",
        value: category,
        optionLabel: "name",
        optionValue: "_id",
        options: categories?.documents || [],
        placeholder: "Select Category",
        setState: setCategory
    }

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Products"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Product"
                    isCreate
                    isBack
                />
                <SearchFilterSelect
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    filterData={filterData}
                    refetch={refetch}
                    isSelect={true}
                    selectData={selectData}
                />
                <DataTable
                    data={documents}
                    columns={columns}
                    setTargetID={setTargetID}
                    setShowArchiveModal={setShowArchiveModal}
                    setShowUpdateForm={setShowUpdateForm}
                    setShowItem={setShowItem}
                    ItemActionsMenu={ProductActionsMenu}
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
                api={'product/archiveProduct/'}
                singleItemApi={'product/getSingleProduct/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Product"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Product"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateProduct}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewProduct}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateProduct}
            />
        </Layout>
    );
}

export default Products;
