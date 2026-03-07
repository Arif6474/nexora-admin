import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import HeaderControls from '@/components/Shared/HeaderControls'
import { useGetOrdersReportQuery } from '../../redux/features/dashboard/dashboardApi'
import { IconCalendar, IconChartBar, IconDownload, IconArrowRight } from '@tabler/icons-react'
import Loader from '../../components/Shared/loader/loader'

function OrdersReport() {
    const [groupBy, setGroupBy] = useState('day')
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    })

    // Presets
    const setPreset = (days) => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - days)
        setDateRange({
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        })
    }

    const { data, isLoading } = useGetOrdersReportQuery({
        groupBy,
        ...dateRange
    })

    const reportData = data?.report || []

    // Calculate totals for summary cards
    const totalStats = reportData.reduce((acc, curr) => ({
        orders: acc.orders + curr.totalOrders,
        sales: acc.sales + curr.totalSales,
        discount: acc.discount + curr.totalDiscount,
        delivered: acc.delivered + curr.deliveredCount
    }), { orders: 0, sales: 0, discount: 0, delivered: 0 })

    return (
        <Layout>
            <HeaderControls isSearch />
            <div className="p-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-2">Orders report</h1>
                        <p className="text-stone-500 font-medium">Analyze sales performance and order trends.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                            {['day', 'week', 'month'].map((interval) => (
                                <button
                                    key={interval}
                                    onClick={() => setGroupBy(interval)}
                                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${groupBy === interval
                                            ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                                            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                                        }`}
                                >
                                    {interval}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1 rounded-xl">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                className="bg-transparent text-xs font-bold p-2 focus:outline-none"
                            />
                            <IconArrowRight size={14} className="text-stone-300" />
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                className="bg-transparent text-xs font-bold p-2 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={() => setPreset(7)}
                            className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-stone-400"
                            title="Last 7 Days"
                        >
                            <IconCalendar size={20} />
                        </button>
                    </div>
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ReportSummaryCard title="Total orders" value={totalStats.orders} color="emerald" />
                    <ReportSummaryCard title="Total revenue" value={`$${totalStats.sales.toLocaleString()}`} color="blue" />
                    <ReportSummaryCard title="Delivered" value={totalStats.delivered} color="purple" />
                    <ReportSummaryCard title="Discounts" value={`$${totalStats.discount.toLocaleString()}`} color="rose" />
                </div>

                {/* Report Table */}
                <div className="bg-white dark:bg-stone-900/50 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                                <IconChartBar className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 italic capitalize">{groupBy}ly metrics</h2>
                                <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mt-1">Detailed breakdown</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                            <IconDownload size={16} />
                            Export
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-20 flex justify-center">
                                <Loader height="100px" />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50/50 dark:bg-stone-800/20">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Date / Period</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Orders</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Delivered</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">Pending</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
                                    {reportData.length > 0 ? reportData.map((row) => (
                                        <tr key={row._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-stone-900 dark:text-stone-100">{row._id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-stone-600 dark:text-stone-400">{row.totalOrders}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${row.deliveredCount > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-stone-50 text-stone-400 border-stone-100 dark:bg-stone-800 dark:text-stone-600 dark:border-stone-700'
                                                    }`}>
                                                    {row.deliveredCount} Delivered
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{row.pendingCount}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-stone-900 dark:text-stone-100">${row.totalSales.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">No data available for this range</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

function ReportSummaryCard({ title, value, color }) {
    const colors = {
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
        rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400"
    }
    return (
        <div className="bg-white dark:bg-stone-900/50 p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm group hover:scale-[1.02] transition-transform">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tighter">{value}</span>
            </div>
            <div className={`mt-4 h-1 w-12 rounded-full ${colors[color].split(' ')[1]}`} />
        </div>
    )
}

export default OrdersReport
