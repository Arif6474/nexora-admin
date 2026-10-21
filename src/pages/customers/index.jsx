import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetCustomersQuery } from '../../redux/features/customers/customerApi';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import CustomerActionsMenu from './components/customerActionsMenu';
import ViewCustomer from './components/ViewCustomer';
import UpdateCustomer from './components/UpdateCustomer';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import {
    IconShoppingBag,
    IconMail,
    IconPhone,
    IconMapPin
} from '@tabler/icons-react';

function Customers() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10 });
    const {
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetCustomersQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    const columns = [
        {
            accessorKey: 'name',
            header: 'Customer',
            cell: ({ row }) => {
                const item = row.original;
                const avatarSrc = item?.image?.startsWith('http')
                    ? item.image
                    : item?.image
                    ? `${import.meta.env.VITE_REACT_APP_SPACES_URL || ''}${item.image}`
                    : null;
                const initial = item?.name ? item.name.charAt(0).toUpperCase() : 'C';

                return (
                    <div className="flex items-center gap-3 py-1">
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-[#222838] flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 font-bold text-sm flex-shrink-0">
                                {initial}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-bold text-sm text-stone-900 dark:text-white truncate">
                                {item.name || 'Anonymous User'}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1 truncate mt-0.5">
                                <IconMail size={12} className="flex-shrink-0" />
                                {item.email}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'phone',
            header: 'Contact & Location',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="space-y-0.5">
                        <div className="text-xs font-medium text-stone-700 dark:text-zinc-300 flex items-center gap-1">
                            <IconPhone size={12} className="text-stone-400" />
                            <span>{item.phone || 'No phone'}</span>
                        </div>
                        {item.address ? (
                            <div className="text-[11px] text-stone-400 dark:text-zinc-500 flex items-center gap-1 truncate max-w-xs">
                                <IconMapPin size={12} className="flex-shrink-0" />
                                <span className="truncate">{item.address}</span>
                            </div>
                        ) : (
                            <span className="text-[11px] text-stone-400 italic">No address set</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'orderCount',
            header: 'Orders',
            cell: ({ row }) => {
                const item = row.original;
                const count = item.orderCount || 0;
                return (
                    <button
                        type="button"
                        onClick={() => navigate(`/customer-orders/${item._id}`)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                            count > 0
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 hover:bg-amber-500/25 hover:border-amber-500/40'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-zinc-400 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                        title="View customer orders"
                    >
                        <IconShoppingBag size={12} />
                        {count} {count === 1 ? 'order' : 'orders'}
                    </button>
                );
            },
        },
        {
            accessorKey: 'totalSpent',
            header: 'Total Spent',
            cell: ({ row }) => {
                const spent = row.original.totalSpent || 0;
                return (
                    <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                        ${spent.toLocaleString()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                        isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-500 border-rose-500/25'
                    }`}>
                        {isActive ? 'Active' : 'Archived'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: ({ row }) => {
                const date = row.original.createdAt;
                return (
                    <span className="text-xs text-stone-500 dark:text-zinc-400">
                        {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </span>
                );
            },
        },
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
           

                <ScreenHeader
                    title="Customers"
                    isCreate={false}
                    isBack
                    isSearch={true}
                    search={search}
                    setSearch={setSearch}
                    searchPlaceholder="Search by name, email, phone, or location..."
                    isFilter={true}
                    filter={filter}
                    setFilter={setFilter}
                    filterData={filterData}
                />

                <DataTable
                    data={documents}
                    columns={columns}
                    setTargetID={setTargetID}
                    setShowArchiveModal={setShowArchiveModal}
                    setShowUpdateForm={setShowUpdateForm}
                    setShowItem={setShowItem}
                    ItemActionsMenu={CustomerActionsMenu}
                    isLoading={isLoading}
                />

                {!isLoading && (
                    <Pagination
                        totalPages={totalPages}
                        items={documents}
                        totalItems={totalItems}
                        queryParams={queryParams}
                        setQueryParams={setQueryParams}
                    />
                )}
            </ScreenWrapper>

            <ArchiveItem
                api={'customer/archiveCustomer/'}
                singleItemApi={'customer/getSingleCustomer/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Customer"}
                refetch={refetch}
            />

            <ShowCrudModal
                modalHeading="Customer"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewCustomer}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateCustomer}
            />
        </Layout>
    );
}

export default Customers;
