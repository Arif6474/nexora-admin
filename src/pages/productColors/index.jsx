import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetProductColorsQuery } from '../../redux/features/productColors/productColorApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import ProductColorActionsMenu from './components/productColorActionsMenu';
import CreateProductColor from './components/CreateProductColor';
import ViewProductColor from './components/ViewProductColor';
import UpdateProductColor from './components/UpdateProductColor';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { useParams } from 'react-router-dom';

function ProductColors() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const { productId } = useParams()
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10, product: productId });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetProductColorsQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'product.title', title: 'Product ' }),
        createColumn({ accessorKey: 'color.name', title: 'Color Name' }),
        createColumn({ accessorKey: 'serial', customCell: 'serial' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Product Colors"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Product Color"
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
                    ItemActionsMenu={ProductColorActionsMenu}
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
                api={'productColor/archiveProductColor/'}
                singleItemApi={'productColor/getSingleProductColor/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Product Color"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Product Color"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateProductColor}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewProductColor}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateProductColor}
                parentID={productId}
            />
        </Layout>
    );
}

export default ProductColors;
