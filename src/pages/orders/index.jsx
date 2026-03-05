import React from 'react'
import {
    IconRepeat,
    IconShoppingCartCheck,
    IconShoppingCartDown,
    IconShoppingCartHeart,
    IconShoppingCartX,
    IconTruckDelivery,
    IconTruckReturn,
    IconLayoutDashboard
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useGetOrderCountByStatusQuery } from '../../redux/features/orders/orderApi';

function Orders() {
    const { data: countsData, isLoading } = useGetOrderCountByStatusQuery();
    const orderCounts = countsData?.orderCounts || {};

    return (
        <div className='p-8 space-y-10'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-2">Orders Overview</h1>
                    <p className="text-stone-500 font-medium">Manage and track your business fulfillment cycle.</p>
                </div>
                <div className="p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                    <IconLayoutDashboard className="w-6 h-6 text-stone-400" />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                <Stats status='Pending' Icon={IconShoppingCartHeart} count={orderCounts['Pending'] || 0} loading={isLoading} />
                <Stats status='Processing' Icon={IconRepeat} count={orderCounts['Processing'] || 0} loading={isLoading} />
                <Stats status='Shipped' Icon={IconTruckDelivery} count={orderCounts['Shipped'] || 0} loading={isLoading} />
                <Stats status='Delivered' Icon={IconShoppingCartCheck} count={orderCounts['Delivered'] || 0} loading={isLoading} />
                <Stats status='Cancelled' Icon={IconShoppingCartX} count={orderCounts['Cancelled'] || 0} loading={isLoading} />
                <Stats status='Returned' Icon={IconTruckReturn} count={orderCounts['Returned'] || 0} loading={isLoading} />
            </div>
        </div>
    )
}

export default Orders


function Stats({ Icon, status, count, loading }) {
    const navigate = useNavigate()
    const colorClasses = getStatusColor(status);

    return (
        <div
            onClick={() => {
                navigate(`/ordersByStatus/${status}`)
            }}
            className={`group relative overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-6 rounded-[2.5rem] p-12 transition-all duration-500 hover:scale-[1.03] active:scale-95 border shadow-sm ${colorClasses.container}`}>

            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${colorClasses.glow}`} />

            <div className={`relative p-5 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${colorClasses.iconBg}`}>
                <Icon className={`h-10 w-10 ${colorClasses.icon}`} />
            </div>

            <div className='relative flex flex-col items-center text-center'>
                <span className={`text-5xl font-black tracking-tighter mb-2 transition-colors duration-500 ${colorClasses.text}`}>
                    {loading ? "..." : count}
                </span>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${colorClasses.dot}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-70 ${colorClasses.text}`}>
                        {status} Orders
                    </span>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 transition-opacity opacity-0 group-hover:opacity-100 ${colorClasses.accent}`} />
        </div>
    )
}

const getStatusColor = (status) => {
    switch (status) {
        case "Pending":
            return {
                container: "bg-orange-50/30 border-orange-100 hover:border-orange-200 dark:bg-orange-950/10 dark:border-orange-900/30 dark:hover:border-orange-800/50 backdrop-blur-md",
                icon: "text-orange-600 dark:text-orange-400",
                iconBg: "bg-orange-100 dark:bg-orange-900/30",
                text: "text-orange-900 dark:text-orange-100",
                glow: "bg-orange-400",
                dot: "bg-orange-500",
                accent: "bg-orange-500"
            }
        case "Processing":
            return {
                container: "bg-amber-50/30 border-amber-100 hover:border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30 dark:hover:border-amber-800/50 backdrop-blur-md",
                icon: "text-amber-600 dark:text-amber-400",
                iconBg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-900 dark:text-amber-100",
                glow: "bg-amber-400",
                dot: "bg-amber-500",
                accent: "bg-amber-500"
            }
        case "Shipped":
            return {
                container: "bg-blue-50/30 border-blue-100 hover:border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/30 dark:hover:border-blue-800/50 backdrop-blur-md",
                icon: "text-blue-600 dark:text-blue-400",
                iconBg: "bg-blue-100 dark:bg-blue-900/30",
                text: "text-blue-900 dark:text-blue-100",
                glow: "bg-blue-400",
                dot: "bg-blue-500",
                accent: "bg-blue-500"
            }
        case "Delivered":
            return {
                container: "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:hover:border-emerald-800/50 backdrop-blur-md",
                icon: "text-emerald-600 dark:text-emerald-400",
                iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-900 dark:text-emerald-100",
                glow: "bg-emerald-400",
                dot: "bg-emerald-500",
                accent: "bg-emerald-500"
            }
        case "Cancelled":
            return {
                container: "bg-rose-50/30 border-rose-100 hover:border-rose-200 dark:bg-rose-950/10 dark:border-rose-900/30 dark:hover:border-rose-800/50 backdrop-blur-md",
                icon: "text-rose-600 dark:text-rose-400",
                iconBg: "bg-rose-100 dark:bg-rose-900/30",
                text: "text-rose-900 dark:text-rose-100",
                glow: "bg-rose-400",
                dot: "bg-rose-500",
                accent: "bg-rose-500"
            }
        case "Returned":
            return {
                container: "bg-stone-50/30 border-stone-200 hover:border-stone-300 dark:bg-stone-900/10 dark:border-stone-800/30 dark:hover:border-stone-700/50 backdrop-blur-md",
                icon: "text-stone-600 dark:text-stone-400",
                iconBg: "bg-stone-100 dark:bg-stone-800/50",
                text: "text-stone-900 dark:text-stone-100",
                glow: "bg-stone-400",
                dot: "bg-stone-500",
                accent: "bg-stone-500"
            }
        default:
            return {
                container: "bg-slate-50/30 border-slate-100 hover:border-slate-200 dark:bg-slate-950/10 dark:border-slate-900/30 dark:hover:border-slate-800/50 backdrop-blur-md",
                icon: "text-slate-600 dark:text-slate-400",
                iconBg: "bg-slate-100 dark:bg-slate-900/30",
                text: "text-slate-900 dark:text-slate-100",
                glow: "bg-slate-400",
                dot: "bg-slate-500",
                accent: "bg-slate-500"
            }
    }
}