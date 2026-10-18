import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import Loader from '@/components/Shared/loader/loader';
import useCommonUtilities from '@/utils/Hooks/useCommonUtilities';
import ShowCrudModal from '@/components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '@/components/Shared/ArchiveItem/ArchiveItem';
import { DataTable } from '@/components/layout/CRUD/dataTable/dataTable';
import Pagination from '@/components/Shared/Pagination/Pagination';
import OrderActionsMenu from '@/pages/ordersByStatus/components/orderActionsMenu';
import ViewOrder from '@/pages/ordersByStatus/components/ViewOrder';
import UpdateOrderStatus from '@/pages/ordersByStatus/components/UpdateOrderStatus';
import { useGetOrdersQuery } from '@/redux/features/orders/orderApi';
import { useSingleCustomerQuery } from '@/redux/features/customers/customerApi';
import {
    IconMail,
    IconPhone,
    IconMapPin,
    IconShoppingBag,
    IconCurrencyDollar,
    IconCreditCard,
    IconCash,
    IconCopy,
    IconCheck,
    IconUser
} from '@tabler/icons-react';
import toast from 'react-hot-toast';

export default function CustomerOrders() {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        limit: 10,
        customerId: customerId,
    });

    const {
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const [copiedId, setCopiedId] = useState(null);

    // Fetch customer details
    const { data: customer, isLoading: customerLoading } = useSingleCustomerQuery(
        { id: customerId },
        { skip: !customerId }
    );

    // Sync status filter with queryParams
    useEffect(() => {
        setQueryParams((prev) => ({
            ...prev,
            currentPage: 1,
            customerId: customerId,
            orderStatus: statusFilter === 'All' ? undefined : statusFilter,
        }));
    }, [statusFilter, customerId]);

    // Fetch orders for this customer
    const { data, isLoading: ordersLoading, refetch } = useGetOrdersQuery({
        search,
        filter: 'Active',
        queryParams,
    });

    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};

    const handleCopy = (text, e) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        toast.success('Order ID copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (customerLoading) return <Loader />;

    const avatarSrc = customer?.image?.startsWith('http')
        ? customer.image
        : customer?.image
        ? `${import.meta.env.VITE_REACT_APP_SPACES_URL || ''}${customer.image}`
        : null;
    const initial = customer?.name ? customer.name.charAt(0).toUpperCase() : 'C';

    const statusBadgeColors = {
        Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        Processing: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
        Shipped: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
        Delivered: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        Completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        Cancelled: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        Returned: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/30',
    };

    const statusTabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

    const columns = [
        {
            accessorKey: 'orderId',
            header: 'Order ID',
            cell: ({ row }) => {
                const item = row.original;
                const isCopied = copiedId === item.orderId;
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                            {item.orderId}
                        </span>
                        <button
                            type="button"
                            onClick={(e) => handleCopy(item.orderId, e)}
                            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1a202c] transition-colors"
                            title="Copy Order ID"
                        >
                            {isCopied ? <IconCheck size={13} className="text-emerald-500" /> : <IconCopy size={13} />}
                        </button>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Date Placed',
            cell: ({ row }) => {
                const date = row.original.createdAt;
                if (!date) return <span className="text-xs text-stone-400">—</span>;
                return (
                    <div className="text-xs text-stone-600 dark:text-zinc-300">
                        <p className="font-medium">
                            {new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                        <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                            {new Date(date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: 'products',
            header: 'Items',
            cell: ({ row }) => {
                const products = row.original.products || [];
                const totalUnits = products.reduce((acc, p) => acc + (p.quantity || 1), 0);
                return (
                    <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-zinc-200">
                            <IconShoppingBag size={13} className="text-stone-400" />
                            {totalUnits} {totalUnits === 1 ? 'unit' : 'units'} ({products.length} {products.length === 1 ? 'item' : 'items'})
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'paymentMethod',
            header: 'Payment',
            cell: ({ row }) => {
                const item = row.original;
                const isCard = item.paymentMethod === 'card';
                const isPaid = item.paymentStatus === 'Completed';

                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700 dark:text-zinc-300">
                            {isCard ? (
                                <IconCreditCard size={13} className="text-indigo-500" />
                            ) : (
                                <IconCash size={13} className="text-emerald-500" />
                            )}
                            <span className="capitalize">{item.paymentMethod || 'COD'}</span>
                        </div>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase tracking-wider ${
                            isPaid
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                            {item.paymentStatus || 'Pending'}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'orderStatus',
            header: 'Order Status',
            cell: ({ row }) => {
                const status = row.original.orderStatus || 'Pending';
                const colorClass = statusBadgeColors[status] || 'bg-stone-500/15 text-stone-600 border-stone-500/30';

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${colorClass}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: 'finalAmount',
            header: 'Total Amount',
            cell: ({ row }) => {
                const item = row.original;
                const finalAmt = item.finalAmount ?? item.totalAmount ?? 0;
                const hasDiscount = item.discount && item.discount > 0;

                return (
                    <div>
                        <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                            ${Number(finalAmt).toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="block text-[10px] text-emerald-500 font-semibold">
                                -${item.discount} discount
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                {/* Customer Info Card Banner */}
                <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={customer?.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-[#222838] shadow-sm flex-shrink-0"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 font-extrabold text-xl flex-shrink-0">
                                {initial}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-stone-900 dark:text-white">
                                    {customer?.name || 'Customer'}
                                </h2>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                    customer?.isActive
                                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25'
                                        : 'bg-rose-500/15 text-rose-500 border-rose-500/25'
                                }`}>
                                    {customer?.isActive ? 'Active' : 'Archived'}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-500 dark:text-zinc-400">
                                {customer?.email && (
                                    <span className="flex items-center gap-1">
                                        <IconMail size={13} className="text-stone-400" />
                                        {customer.email}
                                    </span>
                                )}
                                {customer?.phone && (
                                    <span className="flex items-center gap-1">
                                        <IconPhone size={13} className="text-stone-400" />
                                        {customer.phone}
                                    </span>
                                )}
                                {customer?.address && (
                                    <span className="flex items-center gap-1">
                                        <IconMapPin size={13} className="text-stone-400" />
                                        {customer.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Metrics */}
                    <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-[#1e2330]">
                        <div className="text-right sm:text-left md:text-right">
                            <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block">
                                Total Orders
                            </span>
                            <span className="text-xl font-black text-stone-900 dark:text-white">
                                {customer?.orderCount || totalItems}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-stone-200 dark:bg-[#1e2330]" />
                        <div className="text-right sm:text-left md:text-right">
                            <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block">
                                Lifetime Spend
                            </span>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                ${Number(customer?.totalSpent || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Tabs Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
                    {statusTabs.map((status) => {
                        const isSelected = statusFilter === status;
                        return (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    isSelected
                                        ? 'bg-amber-500 text-stone-900 shadow-sm'
                                        : 'bg-white dark:bg-[#11141b] text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-[#1e2330]'
                                }`}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>

                {/* Screen Header */}
                {/* <ScreenHeader
                    title={`${customer?.name ? `${customer.name}'s Orders` : 'Customer Orders'}`}
                    isCreate={false}
                    isBack={true}
                    isSearch={true}
                    search={search}
                    setSearch={setSearch}
                    searchPlaceholder="Search by order ID..."
                    isFilter={false}
                /> */}

                {/* Orders Data Table */}
                {ordersLoading ? (
                    <Loader height="30dvh" />
                ) : (
                    <DataTable
                        data={documents}
                        columns={columns}
                        setTargetID={setTargetID}
                        setShowArchiveModal={setShowArchiveModal}
                        setShowUpdateForm={setShowUpdateForm}
                        setShowItem={setShowItem}
                        ItemActionsMenu={OrderActionsMenu}
                    />
                )}

                {/* Pagination */}
                <Pagination
                    totalPages={totalPages}
                    items={documents}
                    totalItems={totalItems}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                />
            </ScreenWrapper>

            {/* Archive Order Modal */}
            <ArchiveItem
                api={'orders/archiveOrder/'}
                singleItemApi={'order/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Order"}
                refetch={refetch}
            />

            {/* Modals for View Order Details and Update Status */}
            <ShowCrudModal
                modalHeading="Order"
                refetch={refetch}
                targetID={targetID}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewOrder}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateOrderStatus}
                maxWidth={{
                    view: 1080,
                }}
            />
        </Layout>
    );
}
