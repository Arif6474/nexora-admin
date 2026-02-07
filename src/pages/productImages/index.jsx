import { useEffect, useState } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import SearchFilterSelect from '@/components/Shared/searchFilterSelect/searchFilterSelect';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import Loader from '../../components/Shared/loader/loader';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import ProductImageActionsMenu from './components/productImageActionsMenu';
import CreateProductImage from './components/CreateProductImage';
import UpdateProductImage from './components/UpdateProductImage';
import ViewProductImage from './components/ViewProductImage';
import Pagination from '../../components/Shared/Pagination/Pagination';
import { useParams } from 'react-router-dom';
import { useGetAllProductImagesQuery } from '../../redux/features/productImages/productImageApi';

export default function ProductImages() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const { productId } = useParams();
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10, product: productId });

    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetAllProductImagesQuery({
        search,
        filter,
        queryParams
    });

    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />;

    const columns = [
        createColumn({ accessorKey: 'product.title', title: 'Product' }),
        createColumn({ accessorKey: 'image', customCell: 'Image', image: true }),
        createColumn({ accessorKey: 'serial', title: 'Serial' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Product Images"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Add Product Image"
                    isCreate
                    isBack
                />
                <SearchFilterSelect
                    filterData={filterData}
                    setFilter={setFilter}
                    setSearch={setSearch}
                />
                <DataTable
                    columns={columns}
                    data={documents}
                    ItemActionsMenu={(props) => (
                        <ProductImageActionsMenu
                            {...props}
                            setShowUpdateForm={setShowUpdateForm}
                            setShowItem={setShowItem}
                            setTargetID={setTargetID}
                            refetch={refetch}
                        />
                    )}
                />
                <Pagination
                    totalPages={totalPages}
                    totalItems={totalItems}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                />
            </ScreenWrapper>

            <ShowCrudModal
                modalHeading="Product Image"
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateProductImage}
                parentID={productId}
                refetch={refetch}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewProductImage}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateProductImage}
                targetID={targetID}
            />
        </Layout>
    );
}
