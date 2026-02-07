import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '../../components/Shared/loader/loader';
import SearchFilterSelect from '../../components/Shared/searchFilterSelect/searchFilterSelect';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import OrderActionsMenu from './components/orderActionsMenu';
import ViewOrder from './components/ViewOrder';
import UpdateOrderStatus from './components/UpdateOrderStatus';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { useGetOrdersQuery } from '../../redux/features/orders/orderApi';

function OrdersByStatus() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const { orderStatus } = useParams();
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10, orderStatus: orderStatus });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();


    const { data, isLoading, refetch } = useGetOrdersQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};


    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    if (isLoading) return <Loader />

    const columns = [
        createColumn({ accessorKey: 'orderId', title: 'Order ID' }),
        createColumn({ accessorKey: 'customer.name', title: 'Customer' }),
        createColumn({ accessorKey: 'customer.phone', title: 'Phone' }),
        createColumn({ accessorKey: 'totalAmount', title: 'Order Total' }),
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title={`${orderStatus} Orders`}
                    setShowCreateForm={setShowCreateForm}
                    btnText="Orders"
                    isCreate={false}
                    isBack

                />
                <SearchFilterSelect
                    setSearch={setSearch}
                    isFilter={false}
                    refetch={refetch}
                />
                <DataTable
                    data={documents}
                    columns={columns}
                    setTargetID={setTargetID}
                    setShowArchiveModal={setShowArchiveModal}
                    setShowUpdateForm={setShowUpdateForm}
                    setShowItem={setShowItem}
                    ItemActionsMenu={OrderActionsMenu}
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
                api={'orders/archiveOrder/'}
                singleItemApi={'orders/getSingleOrder/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Order"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Order"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewOrder}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateOrderStatus}
                maxWidth={{
                    view: 1000,
                }}
            />
        </Layout>
    );
}

export default OrdersByStatus;
