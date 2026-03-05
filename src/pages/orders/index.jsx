import React from 'react'
import { IconRepeat, IconShoppingCartCheck, IconShoppingCartDown, IconShoppingCartHeart, IconShoppingCartX, IconTruckDelivery, IconTruckReturn } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useGetOrderCountByStatusQuery } from '../../redux/features/orders/orderApi';

function Orders() {
    const { data: countsData, isLoading } = useGetOrderCountByStatusQuery();
    const orderCounts = countsData?.orderCounts || {};

    return (
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-4'>
            <Stats status='Pending' Icon={IconShoppingCartHeart} count={orderCounts['Pending'] || 0} loading={isLoading} />
            <Stats status='Processing' Icon={IconRepeat} count={orderCounts['Processing'] || 0} loading={isLoading} />
            <Stats status='Shipped' Icon={IconTruckDelivery} count={orderCounts['Shipped'] || 0} loading={isLoading} />
            <Stats status='Delivered' Icon={IconShoppingCartCheck} count={orderCounts['Delivered'] || 0} loading={isLoading} />
            <Stats status='Cancelled' Icon={IconShoppingCartX} count={orderCounts['Cancelled'] || 0} loading={isLoading} />
            <Stats status='Returned' Icon={IconTruckReturn} count={orderCounts['Returned'] || 0} loading={isLoading} />
        </div>
    )
}

export default Orders


function Stats({ Icon, status, count, loading }) {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => {
                navigate(`/ordersByStatus/${status}`)
            }}
            className={`cursor-pointer flex flex-col items-center justify-center gap-2 rounded-lg p-10 transition-all hover:scale-105 active:scale-95 ${getStatusColor(status)}`}>
            <h2 className='text-lg font-medium'>
                <Icon className='h-12 w-12' />
            </h2>
            <div className='flex flex-col items-center'>
              
                <span className='text-xs font-black uppercase tracking-widest opacity-80'>{status}({loading ? "..." : count})</span>
            </div>
        </div>
    )
}

const getStatusColor = (status) => {
    console.log({ status });
    switch (status) {
        case "Pending":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
        case "Processing":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        case "Shipped":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        // case "Delivered":
        //     return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
        case "Delivered":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        case "Cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
}