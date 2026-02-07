import React from 'react'
import { IconRepeat, IconShoppingCartCheck, IconShoppingCartDown, IconShoppingCartHeart, IconShoppingCartX, IconTruckDelivery, IconTruckReturn } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function Orders() {
    return (
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-4'>
            <Stats status='Pending' Icon={IconShoppingCartHeart} />
            <Stats status='Processing' Icon={IconRepeat} />
            <Stats status='Shipped' Icon={IconTruckDelivery} />
            <Stats status='Delivered' Icon={IconShoppingCartDown} />
            <Stats status='Cancelled' Icon={IconShoppingCartX} />
            <Stats status='Returned' Icon={IconTruckReturn} />
        </div>
    )
}

export default Orders


function Stats({ Icon, status }) {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => {
                navigate(`/ordersByStatus/${status}`)
            }}
            className={`cursor-pointer flex flex-col items-center justify-center gap-2 rounded-lg p-10 ${getStatusColor(status)}`}>
            <h2 className='text-lg font-medium'>
                <Icon className='h-12 w-12' />
            </h2>
            <span className='text-xl font-medium'>{status} Orders</span>
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
        case "Delivered":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
        case "Completed":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        case "Cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
}