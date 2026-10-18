import { useState, useMemo, useRef, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import { useGetOrdersReportQuery } from '../../redux/features/dashboard/dashboardApi';
import {
    IconCalendar,
    IconCalendarEvent,
    IconCalendarMonth,
    IconChartBar,
    IconChevronLeft,
    IconChevronRight,
    IconChevronDown,
    IconSearch,
    IconFilter,
    IconSparkles,
    IconDownload,
    IconShoppingBag,
    IconCurrencyDollar,
    IconPackage,
    IconReceipt,
    IconRotateClockwise,
    IconClock,
    IconCheck,
    IconCopy,
    IconEye,
    IconX,
    IconPlus
} from '@tabler/icons-react';
import Loader from '../../components/Shared/loader/loader';
import ViewOrder from '@/pages/ordersByStatus/components/ViewOrder';
import ShowCrudModal from '@/components/layout/CRUD/showCrudModal/showCrudModal';
import toast from 'react-hot-toast';

export default function OrdersReport() {
    // Mode: 'daily' | 'monthly' | 'yearly'
    const [mode, setMode] = useState('daily');

    // Selected temporal anchor (default to current reference date: Oct 18, 2026 or today)
    const [selectedDate, setSelectedDate] = useState(() => {
        // Defaults to Oct 18, 2026 to match repository's current active timeline
        const d = new Date();
        d.setFullYear(2026, 9, 18); // Oct is 9 (0-indexed)
        return d;
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTargetOrderId, setActiveTargetOrderId] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Compute date ranges based on active mode
    const { startDate, endDate, groupBy, displayLabel } = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const date = selectedDate.getDate();

        if (mode === 'daily') {
            const pad = (n) => String(n).padStart(2, '0');
            const dateStr = `${year}-${pad(month + 1)}-${pad(date)}`;
            const label = selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            return {
                startDate: dateStr,
                endDate: dateStr,
                groupBy: 'day',
                displayLabel: label,
            };
        }

        if (mode === 'monthly') {
            const pad = (n) => String(n).padStart(2, '0');
            const lastDay = new Date(year, month + 1, 0).getDate();
            const startStr = `${year}-${pad(month + 1)}-01`;
            const endStr = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
            const label = selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
            });
            return {
                startDate: startStr,
                endDate: endStr,
                groupBy: 'month',
                displayLabel: label,
            };
        }

        // yearly
        const startStr = `${year}-01-01`;
        const endStr = `${year}-12-31`;
        return {
            startDate: startStr,
            endDate: endStr,
            groupBy: 'year',
            displayLabel: `Year ${year}`,
        };
    }, [mode, selectedDate]);

    // Query backend for delivered orders report
    const { data, isLoading, refetch } = useGetOrdersReportQuery({
        startDate,
        endDate,
        groupBy,
    });

    const reportData = data?.report || [];
    const deliveredOrders = data?.orders || [];
    const summary = data?.summary || {
        totalOrders: 0,
        totalSales: 0,
        totalDiscount: 0,
        totalItems: 0,
    };

    // Navigation chevrons on main bar
    const handlePrev = () => {
        setSelectedDate((prev) => {
            const next = new Date(prev);
            if (mode === 'daily') {
                next.setDate(next.getDate() - 1);
            } else if (mode === 'monthly') {
                next.setMonth(next.getMonth() - 1);
            } else {
                next.setFullYear(next.getFullYear() - 1);
            }
            return next;
        });
    };

    const handleNext = () => {
        setSelectedDate((prev) => {
            const next = new Date(prev);
            if (mode === 'daily') {
                next.setDate(next.getDate() + 1);
            } else if (mode === 'monthly') {
                next.setMonth(next.getMonth() + 1);
            } else {
                next.setFullYear(next.getFullYear() + 1);
            }
            return next;
        });
    };

    const handleCopy = (text, e) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        toast.success('Order ID copied');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExport = () => {
        let headers = [];
        let rows = [];
        const filenameDate = startDate === endDate ? startDate : `${startDate}_to_${endDate}`;

        if (mode === 'daily') {
            headers = ['Order ID', 'Delivered At', 'Customer', 'Email', 'Items', 'Payment Method', 'Amount ($)'];
            rows = deliveredOrders.map((o) => [
                `"${o.orderId}"`,
                `"${new Date(o.createdAt).toLocaleString()}"`,
                `"${o.customer?.name || 'Customer'}"`,
                `"${o.customer?.email || 'N/A'}"`,
                o.products?.length || 0,
                `"${o.paymentMethod || 'COD'}"`,
                o.finalAmount || 0,
            ]);
        } else {
            headers = ['Period', 'Delivered Orders', 'Total Sales ($)', 'Total Discounts ($)', 'Units Delivered'];
            rows = reportData.map((r) => [
                `"${r._id}"`,
                r.totalOrders || r.deliveredCount || 0,
                r.totalSales || 0,
                r.totalDiscount || 0,
                r.totalItems || 0,
            ]);
        }

        const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `delivered-report-${mode}-${filenameDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Delivered report exported to CSV');
    };

    // Filter delivered orders in daily mode if search is active
    const filteredDailyOrders = useMemo(() => {
        if (!searchTerm) return deliveredOrders;
        const q = searchTerm.toLowerCase();
        return deliveredOrders.filter(
            (o) =>
                o.orderId?.toLowerCase().includes(q) ||
                o.customer?.name?.toLowerCase().includes(q) ||
                o.customer?.email?.toLowerCase().includes(q)
        );
    }, [deliveredOrders, searchTerm]);

    const avgOrderValue =
        summary.totalOrders > 0 ? (summary.totalSales / summary.totalOrders).toFixed(2) : '0.00';

    return (
        <Layout className="bg-slate-50 dark:bg-[#0b0d11] min-h-screen text-stone-900 dark:text-stone-100">
            <div className="p-4 sm:p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto w-full">
                {/* Screen Header: Title on Left, Existing Design Tabs + Date Navigator + Actions on Right */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Page Title */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                            Orders Report
                        </h1>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                            Real-time order breakdown and revenue performance
                        </p>
                    </div>

                    {/* Right: Existing Design Tabs + Date Navigator + Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        {/* Daily / Monthly / Yearly Tabs with EXACT Existing Design */}
                        <div className="inline-flex items-center bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] p-1 rounded-full shadow-sm">
                            {['daily', 'monthly', 'yearly'].map((interval) => {
                                const isActive = mode === interval;
                                const label =
                                    interval === 'daily'
                                        ? 'Daily'
                                        : interval === 'monthly'
                                        ? 'Monthly'
                                        : 'Yearly';
                                return (
                                    <button
                                        key={interval}
                                        type="button"
                                        onClick={() => setMode(interval)}
                                        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? 'gold-active-gradient text-stone-950 font-bold shadow-sm'
                                                : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Date Navigator Pill < 📅 Date Label > with Interactive Custom Dropdowns */}
                        <div className="relative">
                            <div className="inline-flex items-center bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] rounded-full p-1 shadow-sm">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Previous"
                                >
                                    <IconChevronLeft size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-stone-800 dark:text-zinc-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                >
                                    <IconCalendar size={15} className="text-amber-500 flex-shrink-0" />
                                    <span>{displayLabel}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Next"
                                >
                                    <IconChevronRight size={16} />
                                </button>
                            </div>

                            {/* Custom Dropdown Calendars matching Reference Images 1, 2, 3 */}
                            {isCalendarOpen && (
                                <DateNavigationPopover
                                    mode={mode}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    onClose={() => setIsCalendarOpen(false)}
                                />
                            )}
                        </div>

                    </div>
                </div>

                {/* 4 Summary Cards (Matching media_1792343460858.png exact style & titles) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* 1. Total Orders */}
                    <DeliveredStatCard
                        icon={IconShoppingBag}
                        iconColor="text-amber-500 dark:text-amber-400"
                        iconBg="bg-amber-500/15 border-amber-500/25"
                        title="Total Orders"
                        value={summary.totalOrders}
                        badge="Delivered"
                        badgeColor="text-amber-600 dark:text-amber-400"
                        subtext="Overall Volume"
                        sparklineColor="#f59e0b"
                        sparklinePath="M 2,36 Q 25,34 40,24 T 70,22 T 96,8"
                        cardId="orders-delivered"
                    />

                    {/* 2. Total Revenue */}
                    <DeliveredStatCard
                        icon={IconCurrencyDollar}
                        iconColor="text-emerald-500 dark:text-emerald-400"
                        iconBg="bg-emerald-500/15 border-emerald-500/25"
                        title="Total Revenue"
                        value={`$${summary.totalSales.toLocaleString()}`}
                        badge="Gross Sales"
                        badgeColor="text-emerald-600 dark:text-emerald-400"
                        subtext="Delivered & active"
                        sparklineColor="#10b981"
                        sparklinePath="M 2,38 Q 25,38 45,28 T 72,24 T 96,10"
                        cardId="revenue-delivered"
                    />

                    {/* 3. Delivered */}
                    <DeliveredStatCard
                        icon={IconShoppingBag}
                        iconColor="text-blue-500 dark:text-blue-400"
                        iconBg="bg-blue-500/15 border-blue-500/25"
                        title="Delivered"
                        value={summary.totalOrders}
                        badge="100% Delivered"
                        badgeColor="text-blue-600 dark:text-blue-400"
                        subtext="Successfully received"
                        sparklineColor="#3b82f6"
                        sparklinePath="M 2,38 Q 28,38 45,36 T 70,26 T 96,12"
                        cardId="delivered-count"
                    />

                    {/* 4. Discounts */}
                    <DeliveredStatCard
                        icon={IconReceipt}
                        iconColor="text-purple-500 dark:text-purple-400"
                        iconBg="bg-purple-500/15 border-purple-500/25"
                        title="Discounts"
                        value={`$${summary.totalDiscount.toLocaleString()}`}
                        badge="Promotions Applied"
                        badgeColor="text-purple-600 dark:text-purple-400"
                        subtext="Coupons & offers"
                        sparklineColor="#a855f7"
                        sparklinePath="M 2,38 Q 25,38 45,34 T 70,28 T 96,14"
                        cardId="discounts-applied"
                    />
                </div>

                {/* Main Content Area: Daily, Monthly, or Yearly breakdown */}
                <div className="bg-white dark:bg-[#11141b] rounded-2xl border border-stone-200/90 dark:border-[#1e2330] overflow-hidden shadow-sm dark:shadow-md">
                    {/* Header: Matching media_1792343460858.png */}
                    <div className="p-5 sm:p-6 border-b border-stone-200/90 dark:border-[#1e2330] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0">
                                <IconCalendar size={20} />
                            </div>
                            <div>
                                <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                                    {mode === 'daily'
                                        ? 'Daily Metrics'
                                        : mode === 'monthly'
                                        ? 'Monthly Metrics'
                                        : 'Yearly Metrics'}
                                </h2>
                                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                                    {mode === 'daily'
                                        ? 'Detailed breakdown across day periods'
                                        : mode === 'monthly'
                                        ? 'Detailed breakdown across month periods'
                                        : 'Detailed breakdown across year periods'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25">
                                {mode === 'daily'
                                    ? `${filteredDailyOrders.length} Delivered order(s)`
                                    : `${reportData.length} period(s)`}
                            </span>

                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-[#161a23] dark:hover:bg-[#1c2230] dark:text-zinc-200 border border-stone-200 dark:border-[#1e2330] text-xs font-bold transition-colors cursor-pointer"
                            >
                                <IconDownload size={15} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-16 flex justify-center">
                            <Loader height="80px" />
                        </div>
                    ) : mode === 'daily' ? (
                        /* DAILY MODE TABLE: Individual Delivered Orders */
                        filteredDailyOrders.length > 0 ? (
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-stone-50 dark:bg-[#161a23]/60 border-b border-stone-200/80 dark:border-[#1e2330]">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                                                Time
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                                                Items
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                                                Payment
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 text-right">
                                                Delivered Revenue
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 text-right">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-[#1e2330]">
                                        {filteredDailyOrders.map((order) => {
                                            const isCopied = copiedId === order.orderId;
                                            return (
                                                <tr
                                                    key={order._id}
                                                    className="hover:bg-stone-50/80 dark:hover:bg-white/[0.03] transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                                                                {order.orderId}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleCopy(order.orderId, e)}
                                                                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                                                                title="Copy Order ID"
                                                            >
                                                                {isCopied ? (
                                                                    <IconCheck size={13} className="text-emerald-500" />
                                                                ) : (
                                                                    <IconCopy size={13} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-500 dark:text-zinc-400">
                                                        {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="text-xs font-bold text-stone-900 dark:text-white">
                                                                {order.customer?.name || 'Customer'}
                                                            </p>
                                                            <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                                                                {order.customer?.email || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-700 dark:text-zinc-300">
                                                        <span className="font-bold">{order.products?.length || 0}</span> item(s)
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-300">
                                                            {order.paymentMethod || 'COD'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                                                            ${(order.finalAmount || 0).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveTargetOrderId(order._id);
                                                                setShowOrderModal(true);
                                                            }}
                                                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 dark:bg-[#161a23] dark:hover:bg-[#1c2230] dark:text-zinc-200 transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <IconEye size={13} />
                                                            <span>View</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Reference Image 1 Empty State */
                            <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-[#161a23] border border-stone-200 dark:border-[#222838] flex items-center justify-center text-stone-400 dark:text-zinc-500 mb-4">
                                    <IconClock size={28} />
                                </div>
                                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                                    No Delivered Orders
                                </h3>
                                <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1 max-w-sm">
                                    No delivered order records found for {displayLabel}.
                                </p>
                            </div>
                        )
                    ) : (
                        /* MONTHLY & YEARLY AGGREGATED BREAKDOWN */
                        reportData.length > 0 ? (
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-stone-50 dark:bg-[#161a23]/60 border-b border-stone-200/80 dark:border-[#1e2330]">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 whitespace-nowrap">
                                                {mode === 'monthly' ? 'Date' : 'Month'}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 whitespace-nowrap">
                                                Delivered Orders
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 whitespace-nowrap">
                                                Units Delivered
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 whitespace-nowrap">
                                                Discounts
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 text-right whitespace-nowrap">
                                                Delivered Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-[#1e2330]">
                                        {reportData.map((row) => (
                                            <tr
                                                key={row._id}
                                                className="hover:bg-stone-50/80 dark:hover:bg-white/[0.03] transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-stone-900 dark:text-white">
                                                    {row._id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                                        {row.deliveredCount || row.totalOrders} Delivered
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-stone-700 dark:text-zinc-300">
                                                    {row.totalItems || 0} units
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-zinc-400">
                                                    ${(row.totalDiscount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap font-black text-sm text-stone-900 dark:text-white">
                                                    ${(row.totalSales || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-[#161a23] border border-stone-200 dark:border-[#222838] flex items-center justify-center text-stone-400 dark:text-zinc-500 mb-4">
                                    <IconClock size={28} />
                                </div>
                                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                                    No Delivered Orders
                                </h3>
                                <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1 max-w-sm">
                                    No delivered order records found for {displayLabel}.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* View Order Modal */}
            <ShowCrudModal
                modalHeading="Order Details"
                refetch={refetch}
                targetID={activeTargetOrderId}
                showItem={showOrderModal}
                setShowItem={setShowOrderModal}
                ViewItem={ViewOrder}
                maxWidth={{ view: 1080 }}
            />
        </Layout>
    );
}

/* -------------------------------------------------------------------------- */
/*                     Custom Date Navigation Popovers                        */
/*              (Matching User Reference Images 1, 2, and 3)                   */
/* -------------------------------------------------------------------------- */
function DateNavigationPopover({ mode, selectedDate, setSelectedDate, onClose }) {
    const popoverRef = useRef(null);

    // View states inside popovers
    const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());
    const [decadeStart, setDecadeStart] = useState(() => Math.floor(selectedDate.getFullYear() / 12) * 12);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /* ------------------------------ DAILY MODE ------------------------------ */
    if (mode === 'daily') {
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

        // 7 columns x 6 rows = 42 cells
        const calendarCells = [];
        // Trailing days from previous month
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            calendarCells.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(viewYear, viewMonth - 1, prevMonthLastDay - i),
            });
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarCells.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(viewYear, viewMonth, i),
            });
        }
        // Leading days from next month
        const remaining = 42 - calendarCells.length;
        for (let i = 1; i <= remaining; i++) {
            calendarCells.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(viewYear, viewMonth + 1, i),
            });
        }

        const handleDayClick = (cellDate) => {
            setSelectedDate(cellDate);
            onClose();
        };

        const handleToday = () => {
            setSelectedDate(new Date(2026, 9, 18)); // current timeline anchor
            onClose();
        };

        return (
            <div
                ref={popoverRef}
                className="absolute right-0 mt-2 z-50 w-76 p-4 rounded-2xl bg-[#121620] border border-[#222838] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white"
            >
                {/* Header: Month selector, Year selector, < > */}
                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5">
                        <div className="relative">
                            <select
                                value={viewMonth}
                                onChange={(e) => setViewMonth(Number(e.target.value))}
                                className="appearance-none bg-[#181d28] border border-[#262e3d] text-xs font-bold rounded-lg pl-2.5 pr-6 py-1.5 text-zinc-100 focus:outline-none cursor-pointer"
                            >
                                {months.map((m, idx) => (
                                    <option key={m} value={idx} className="bg-[#121620]">
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <IconChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={viewYear}
                                onChange={(e) => setViewYear(Number(e.target.value))}
                                className="appearance-none bg-[#181d28] border border-[#262e3d] text-xs font-bold rounded-lg pl-2.5 pr-6 py-1.5 text-zinc-100 focus:outline-none cursor-pointer"
                            >
                                {Array.from({ length: 15 }, (_, i) => 2020 + i).map((y) => (
                                    <option key={y} value={y} className="bg-[#121620]">
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <IconChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                if (viewMonth === 0) {
                                    setViewMonth(11);
                                    setViewYear((y) => y - 1);
                                } else {
                                    setViewMonth((m) => m - 1);
                                }
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                            <IconChevronLeft size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (viewMonth === 11) {
                                    setViewMonth(0);
                                    setViewYear((y) => y + 1);
                                } else {
                                    setViewMonth((m) => m + 1);
                                }
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                            <IconChevronRight size={15} />
                        </button>
                    </div>
                </div>

                {/* Day of week labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d} className="text-[11px] font-semibold text-zinc-500 py-1">
                            {d}
                        </span>
                    ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarCells.map((cell, idx) => {
                        const isSelected =
                            cell.isCurrentMonth &&
                            cell.date.getDate() === selectedDate.getDate() &&
                            cell.date.getMonth() === selectedDate.getMonth() &&
                            cell.date.getFullYear() === selectedDate.getFullYear();

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleDayClick(cell.date)}
                                className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                                    isSelected
                                        ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.85)]'
                                        : cell.isCurrentMonth
                                        ? 'text-zinc-200 hover:bg-white/10'
                                        : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                            >
                                {cell.day}
                            </button>
                        );
                    })}
                </div>

                {/* Footer: Today & Close */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1e2330]">
                    <button
                        type="button"
                        onClick={handleToday}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                        <IconRotateClockwise size={13} />
                        <span>Today</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    /* ----------------------------- MONTHLY MODE ----------------------------- */
    if (mode === 'monthly') {
        const handleMonthSelect = (mIdx) => {
            const next = new Date(selectedDate);
            next.setFullYear(viewYear);
            next.setMonth(mIdx);
            setSelectedDate(next);
            onClose();
        };

        const handleCurrentMonth = () => {
            const next = new Date(selectedDate);
            next.setFullYear(2026);
            next.setMonth(9); // Oct 2026
            setSelectedDate(next);
            onClose();
        };

        return (
            <div
                ref={popoverRef}
                className="absolute right-0 mt-2 z-50 w-76 p-4 rounded-2xl bg-[#121620] border border-[#222838] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white"
            >
                {/* Header: Year with < > (Reference Image 3) */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-zinc-200 bg-[#181d28] border border-[#262e3d] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                        <span>{viewYear}</span>
                        <IconChevronDown size={12} className="text-zinc-400" />
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setViewYear((y) => y - 1)}
                            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                            <IconChevronLeft size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewYear((y) => y + 1)}
                            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                            <IconChevronRight size={15} />
                        </button>
                    </div>
                </div>

                {/* 3x4 Month Grid */}
                <div className="grid grid-cols-3 gap-2 min-w-[300px]">
                    {monthShorts.map((m, idx) => {
                        const isSelected =
                            selectedDate.getMonth() === idx && selectedDate.getFullYear() === viewYear;
                        return (
                            <button
                                key={m}
                                type="button"
                                onClick={() => handleMonthSelect(idx)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                                    isSelected
                                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.85)] border border-blue-500'
                                        : 'bg-[#161a23] hover:bg-[#1f2533] text-zinc-300 border border-[#222838]'
                                }`}
                            >
                                {m}
                            </button>
                        );
                    })}
                </div>

                {/* Footer: Current Month & Close */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#1e2330]">
                    <button
                        type="button"
                        onClick={handleCurrentMonth}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                        <IconRotateClockwise size={13} />
                        <span>Current Month</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    /* ----------------------------- YEARLY MODE ------------------------------ */
    const handleYearSelect = (year) => {
        const next = new Date(selectedDate);
        next.setFullYear(year);
        setSelectedDate(next);
        onClose();
    };

    const handleCurrentYear = () => {
        const next = new Date(selectedDate);
        next.setFullYear(2026);
        setSelectedDate(next);
        onClose();
    };

    const years = Array.from({ length: 12 }, (_, i) => decadeStart + i);

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 mt-2 z-50 w-76 p-4 rounded-2xl bg-[#121620] border border-[#222838] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white"
        >
            {/* Header: Decade Range (Reference Image 2) */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-200 bg-[#181d28] border border-[#262e3d] px-2.5 py-1 rounded-lg">
                    {decadeStart} – {decadeStart + 11}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setDecadeStart((d) => d - 12)}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                    >
                        <IconChevronLeft size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDecadeStart((d) => d + 12)}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                    >
                        <IconChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* 3x4 Year Grid */}
            <div className="grid grid-cols-3 gap-2 min-w-[300px]">
                {years.map((y) => {
                    const isSelected = selectedDate.getFullYear() === y;
                    return (
                        <button
                            key={y}
                            type="button"
                            onClick={() => handleYearSelect(y)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                                isSelected
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.85)] border border-blue-500'
                                    : 'bg-[#161a23] hover:bg-[#1f2533] text-zinc-300 border border-[#222838]'
                            }`}
                        >
                            {y}
                        </button>
                    );
                })}
            </div>

            {/* Footer: Current Year & Close */}
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#1e2330]">
                <button
                    type="button"
                    onClick={handleCurrentYear}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                    <IconRotateClockwise size={13} />
                    <span>Current Year</span>
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                            Stat Card Component                             */
/* -------------------------------------------------------------------------- */
function DeliveredStatCard({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    value,
    badge,
    badgeColor,
    subtext,
    sparklineColor,
    sparklinePath,
    cardId,
}) {
    return (
        <div className="bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/40 dark:hover:border-[#2b3345] hover:shadow-lg dark:hover:shadow-xl shadow-sm dark:shadow-md flex flex-col justify-between min-h-[155px]">
            <div>
                {/* Top Icon Badge */}
                <div className={`w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center mb-2.5`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>

                {/* Title & Metric */}
                <h3 className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                    {title}
                </h3>
                <p className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1">
                    {value}
                </p>
            </div>

            {/* Bottom Row: Badge + Glowing Sparkline */}
            <div className="flex items-end justify-between mt-3">
                <div className="min-w-0 pr-2">
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${badgeColor} truncate`}>
                        {badge}
                    </span>
                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-0.5 truncate">{subtext}</p>
                </div>

                {/* Glowing Mini Sparkline */}
                {sparklinePath && (
                    <div className="w-20 h-10 flex-shrink-0">
                        <svg viewBox="0 0 100 45" fill="none" className="w-full h-full overflow-visible">
                            <defs>
                                <filter id={`spark-glow-${cardId}`} x="-30%" y="-30%" width="160%" height="160%">
                                    <feDropShadow
                                        dx="0"
                                        dy="2"
                                        stdDeviation="3"
                                        floodColor={sparklineColor}
                                        floodOpacity="0.6"
                                    />
                                </filter>
                            </defs>
                            <path
                                d={sparklinePath}
                                fill="none"
                                stroke={sparklineColor}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                filter={`url(#spark-glow-${cardId})`}
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
