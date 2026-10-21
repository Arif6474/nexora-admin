import { Skeleton } from "@/components/ui/skeleton";
import { useSingleCustomerQuery } from "../../../redux/features/customers/customerApi";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import {
    IconMail,
    IconPhone,
    IconMapPin,
    IconShoppingBag,
    IconCurrencyDollar,
    IconCalendar,
    IconPackage,
    IconClock
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function ViewCustomer({ targetID }) {
    const { data: customer, isLoading } = useSingleCustomerQuery({ id: targetID });

    if (isLoading) {
        return (
            <div className="pt-2 max-h-[75vh] overflow-y-auto space-y-6 px-1">
                {/* Customer Profile Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-[#121620] border border-stone-200/80 dark:border-[#1e2330]">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-36 rounded-lg" />
                            <Skeleton className="h-4 w-48 rounded-md opacity-70" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-stone-200/70 dark:border-[#1e2330] bg-stone-50/50 dark:bg-[#121620]/50 space-y-2">
                            <Skeleton className="h-3 w-20 rounded opacity-70" />
                            <Skeleton className="h-6 w-24 rounded-lg" />
                        </div>
                    ))}
                </div>
                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-20 rounded opacity-70" />
                        <Skeleton className="h-5 w-48 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-20 rounded opacity-70" />
                        <Skeleton className="h-5 w-40 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    const avatarSrc = customer?.image?.startsWith('http')
        ? customer.image
        : customer?.image
        ? `${import.meta.env.VITE_REACT_APP_SPACES_URL || ''}${customer.image}`
        : null;

    const initial = customer?.name ? customer.name.charAt(0).toUpperCase() : 'C';
    const totalOrders = customer?.orderCount || 0;
    const totalSpent = customer?.totalSpent || 0;
    const avgOrderValue = totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : '0.00';
    const joinedDate = customer?.createdAt
        ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    return (
        <div className="pt-2 max-h-[75vh] overflow-y-auto space-y-6 px-1">
            {/* Customer Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-[#121620] border border-stone-200/80 dark:border-[#1e2330]">
                <div className="flex items-center gap-4">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={customer?.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-[#222838] shadow-sm flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 font-extrabold text-2xl flex-shrink-0">
                            {initial}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                                {customer?.name}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                customer?.isActive
                                    ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25'
                                    : 'bg-rose-500/15 text-rose-500 border-rose-500/25'
                            }`}>
                                {customer?.isActive ? 'Active' : 'Archived'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                                <IconMail size={14} className="text-stone-400" />
                                {customer?.email}
                            </span>
                            {customer?.phone && (
                                <span className="flex items-center gap-1">
                                    <IconPhone size={14} className="text-stone-400" />
                                    {customer.phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-stone-400 dark:text-zinc-500">
                    <IconCalendar size={14} />
                    <span>Joined {joinedDate}</span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] shadow-xs">
                    <div className="flex items-center gap-2.5 text-amber-500 dark:text-amber-400 mb-2">
                        <IconShoppingBag size={18} />
                        <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">Total Orders</span>
                    </div>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">
                        {totalOrders}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] shadow-xs">
                    <div className="flex items-center gap-2.5 text-emerald-500 dark:text-emerald-400 mb-2">
                        <IconCurrencyDollar size={18} />
                        <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">Total Spent</span>
                    </div>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">
                        ${totalSpent.toLocaleString()}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] shadow-xs">
                    <div className="flex items-center gap-2.5 text-indigo-500 dark:text-indigo-400 mb-2">
                        <IconClock size={18} />
                        <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">Avg. Order Value</span>
                    </div>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">
                        ${avgOrderValue}
                    </p>
                </div>
            </div>

            {/* Details: Address & Bio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121620]/60 border border-stone-200/80 dark:border-[#1e2330]">
                    <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 mb-1">
                        <IconMapPin size={15} />
                        <span className="text-xs font-bold uppercase tracking-wider">Delivery Address</span>
                    </div>
                    <p className="text-sm text-stone-800 dark:text-zinc-200 font-medium">
                        {customer?.address || 'No address provided yet.'}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121620]/60 border border-stone-200/80 dark:border-[#1e2330]">
                    <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider">Bio / Notes</span>
                    </div>
                    <p className="text-sm text-stone-800 dark:text-zinc-200 font-medium">
                        {customer?.bio || 'No bio or customer notes recorded.'}
                    </p>
                </div>
            </div>

            {/* Recent Orders List */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                        <IconPackage size={16} className="text-amber-500" />
                        Recent Orders ({customer?.orders?.length || 0})
                    </h4>
                    {customer?._id && (
                        <Link
                            to={`/customer-orders/${customer._id}`}
                            className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                        >
                            View All Customer Orders →
                        </Link>
                    )}
                </div>

                {(!customer?.orders || customer.orders.length === 0) ? (
                    <div className="p-6 text-center text-xs text-stone-400 dark:text-zinc-500 rounded-2xl bg-stone-50/50 dark:bg-[#121620]/40 border border-dashed border-stone-200 dark:border-[#1f2533]">
                        This customer hasn't placed any orders yet.
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {customer.orders.map((order) => {
                            const statusColor = {
                                Delivered: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
                                Completed: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
                                Pending: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
                                Processing: 'bg-blue-500/15 text-blue-500 border-blue-500/25',
                                Shipped: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/25',
                                Cancelled: 'bg-rose-500/15 text-rose-500 border-rose-500/25',
                            }[order.orderStatus] || 'bg-stone-500/15 text-stone-500 border-stone-500/25';

                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            return (
                                <div
                                    key={order._id}
                                    className="p-3.5 rounded-xl bg-white dark:bg-[#11141b] border border-stone-200/80 dark:border-[#1e2330] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-[#181d28] border border-stone-200/80 dark:border-[#222838] flex items-center justify-center font-mono text-xs font-bold text-stone-700 dark:text-zinc-300">
                                            #{order.orderId?.slice(-4) || 'ORD'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-stone-900 dark:text-white">
                                                    {order.orderId}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColor}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5">
                                                Placed on {orderDate} • {order.products?.length || 0} item(s)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4">
                                        <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                                            ${order.finalAmount?.toLocaleString()}
                                        </span>
                                        <Link
                                            to={`/customer-orders/${customer._id}`}
                                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 dark:bg-[#161a23] dark:hover:bg-[#1c2230] dark:text-zinc-300 transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
