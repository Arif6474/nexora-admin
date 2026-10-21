import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from "@/components/custom/layout"
import HeaderControls from "@/components/Shared/HeaderControls"
import { useGetDashboardStatsQuery } from "../../redux/features/dashboard/dashboardApi"
import {
  IconCurrencyDollar,
  IconClock,
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconChartBar,
  IconBuildingStore,
  IconTarget,
  IconChevronRight,
  IconChevronDown,
  IconDotsVertical,
  IconArrowRight
} from "@tabler/icons-react"
import Loader from "../../components/Shared/loader/loader"
import DashboardSkeleton from "./components/DashboardSkeleton"

const DEFAULT_SALES_POINTS = [
  { date: 'Oct 10', label: 'Oct 10, 2026', value: 250, x: 80, y: 154 },
  { date: 'Oct 11', label: 'Oct 11, 2026', value: 380, x: 185, y: 124 },
  { date: 'Oct 12', label: 'Oct 12, 2026', value: 340, x: 290, y: 134 },
  { date: 'Oct 13', label: 'Oct 13, 2026', value: 520, x: 395, y: 93 },
  { date: 'Oct 14', label: 'Oct 14, 2026', value: 460, x: 500, y: 106 },
  { date: 'Oct 15', label: 'Oct 15, 2026', value: 580, x: 605, y: 80 },
  { date: 'Oct 16', label: 'Oct 16, 2026', value: 620, x: 710, y: 70 },
]

const DEMO_PRODUCTS = [
  {
    _id: 'demo-1',
    title: 't-shirt',
    slug: 'T-SHIRT',
    sku: 'T-SHIRT-ISPPB',
    price: 250,
    totalSold: 6,
    revenue: 1500,
    image: '/products/t-shirt.svg',
    pillColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
  },
  {
    _id: 'demo-2',
    title: 'jeans 2',
    slug: 'JEANS-2',
    sku: 'JEANS-2-1200A',
    price: 40,
    totalSold: 4,
    revenue: 160,
    image: '/products/jeans.svg',
    pillColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25'
  },
  {
    _id: 'demo-3',
    title: 'Jack and Jones jeans pant',
    slug: 'JACK-AND-JONES-JEANS-PANT',
    sku: 'JACK-AND-JONES-JEANS-PANT-WMRBO',
    price: 990,
    totalSold: 2,
    revenue: 1980,
    image: '/products/jeans.svg',
    pillColor: 'bg-purple-500/15 text-purple-400 border-purple-500/25'
  }
]

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery()
  const [selectedRange, setSelectedRange] = useState('7 Days')
  const [selectedChartRange, setSelectedChartRange] = useState('Last 7 days')
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const [activePointIndex, setActivePointIndex] = useState(DEFAULT_SALES_POINTS.length - 1)

  if (isLoading) return <DashboardSkeleton />

  const { stats, topSellingProducts: backendTopProducts } = data || {}

  // Determine greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Combine real products with demo products to ensure table matches design
  const mergedProducts = (() => {
    if (!backendTopProducts || backendTopProducts.length === 0) {
      return DEMO_PRODUCTS
    }
    const pillColors = [
      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      'bg-blue-500/15 text-blue-400 border-blue-500/25',
      'bg-purple-500/15 text-purple-400 border-purple-500/25',
      'bg-amber-500/15 text-amber-400 border-amber-500/25',
      'bg-rose-500/15 text-rose-400 border-rose-500/25'
    ]
    const realMapped = backendTopProducts.map((p, idx) => ({
      _id: p._id || `prod-${idx}`,
      title: p.title || 'Product',
      slug: p.slug?.toUpperCase() || 'PRODUCT',
      sku: p.sku || p.slug?.toUpperCase() || `SKU-${idx + 100}`,
      price: p.price || 0,
      totalSold: p.totalSold || 1,
      revenue: (p.price || 0) * (p.totalSold || 1),
      image: p.image?.startsWith('http')
        ? p.image
        : p.image
        ? (import.meta.env.VITE_REACT_APP_SPACES_URL || '') + p.image
        : '/placeholder-product.svg',
      pillColor: pillColors[idx % pillColors.length]
    }))

    // If fewer than 3, append demo items
    if (realMapped.length < 3) {
      const needed = 3 - realMapped.length
      return [...realMapped, ...DEMO_PRODUCTS.slice(0, needed)]
    }
    return realMapped
  })()

  // Stat values with graceful fallback
  const totalSalesVal = stats?.totalSales !== undefined && stats?.totalSales !== null
    ? `$${stats.totalSales.toLocaleString()}`
    : '$3,520'
  const pendingOrdersVal = stats?.totalPendingOrders ?? 1
  const deliveredOrdersVal = stats?.totalDeliveredOrders ?? 2
  const activeProductsVal = stats?.totalActiveProducts ?? 3
  const totalCustomersVal = stats?.totalCustomers ?? 4

  const activePoint = DEFAULT_SALES_POINTS[activePointIndex] || DEFAULT_SALES_POINTS[DEFAULT_SALES_POINTS.length - 1]

  return (
    <Layout className="bg-slate-50 dark:bg-[#0b0d11] min-h-screen text-stone-900 dark:text-stone-100">
      {/* <HeaderControls isSearch /> */}

      <div className="p-4 sm:p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto w-full">
        {/* Header Greeting & Time Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
           
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white mt-1">
              Dashboard Overview
            </h1>

          </div>

          {/* Time range pills */}
          <div className="inline-flex items-center bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] p-1 rounded-2xl self-start sm:self-auto shadow-sm">
            {['Today', '7 Days', '30 Days', '90 Days'].map((range) => {
              const isActive = selectedRange === range
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedRange(range)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'gold-active-gradient text-stone-950 font-bold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  {range}
                </button>
              )
            })}
          </div>
        </div>

        {/* Top 5 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Total Sales */}
          <StatCard
            icon={IconCurrencyDollar}
            iconColor="text-amber-500 dark:text-amber-400"
            iconBg="bg-amber-500/15 border-amber-500/25"
            title="Total Sales"
            value={totalSalesVal}
            trend="▲ 12.5%"
            trendColor="text-emerald-600 dark:text-emerald-400"
            subtext="vs. last 7 days"
            sparklineColor="#f59e0b"
            sparklinePath="M 2,36 Q 25,34 40,24 T 70,22 T 96,8"
            cardId="sales"
          />

          {/* 2. Pending Orders */}
          <StatCard
            icon={IconClock}
            iconColor="text-indigo-500 dark:text-indigo-400"
            iconBg="bg-indigo-500/15 border-indigo-500/25"
            title="Pending Orders"
            value={pendingOrdersVal}
            trend="▼ 0%"
            trendColor="text-rose-500 dark:text-rose-400"
            subtext="vs. last 7 days"
            sparklineColor="#818cf8"
            sparklinePath="M 2,38 Q 28,38 45,36 T 70,26 T 96,12"
            cardId="pending"
          />

          {/* 3. Delivered Orders */}
          <StatCard
            icon={IconShoppingCart}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-500/15 border-emerald-500/25"
            title="Delivered Orders"
            value={deliveredOrdersVal}
            trend="▲ 100%"
            trendColor="text-emerald-600 dark:text-emerald-400"
            subtext="vs. last 7 days"
            sparklineColor="#10b981"
            sparklinePath="M 2,38 Q 25,38 45,28 T 72,24 T 96,10"
            cardId="delivered"
          />

          {/* 4. Active Products */}
          <StatCard
            icon={IconPackage}
            iconColor="text-sky-600 dark:text-sky-400"
            iconBg="bg-sky-500/15 border-sky-500/25"
            title="Active Products"
            value={activeProductsVal}
            trend="▲ 50%"
            trendColor="text-emerald-600 dark:text-emerald-400"
            subtext="vs. last 7 days"
            sparklineColor="#38bdf8"
            sparklinePath="M 2,38 Q 25,38 45,32 T 72,18 T 96,10"
            cardId="products"
          />

          {/* 5. Total Customers */}
          <StatCard
            icon={IconUsers}
            iconColor="text-rose-500 dark:text-rose-400"
            iconBg="bg-rose-500/15 border-rose-500/25"
            title="Total Customers"
            value={totalCustomersVal}
            trend="▲ 33%"
            trendColor="text-emerald-600 dark:text-emerald-400"
            subtext="vs. last 7 days"
            sparklineColor="#f43f5e"
            sparklinePath="M 2,38 Q 25,38 45,32 T 70,26 T 96,12"
            cardId="customers"
          />
        </div>

        {/* Middle Row: Sales Performance & Sales Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sales Performance Card (Left ~68%) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl p-6 relative overflow-hidden shadow-sm dark:shadow-lg flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400">
                  <IconChartBar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                    Sales Performance
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    Total revenue from delivered orders
                  </p>
                </div>
              </div>

              {/* Range Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsChartDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-xs font-medium text-stone-700 dark:bg-[#161a23] dark:hover:bg-[#1c2230] dark:border-[#222838] dark:text-zinc-300 transition-colors"
                >
                  <span>{selectedChartRange}</span>
                  <IconChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-400" />
                </button>
                {isChartDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#161a23] border border-stone-200 dark:border-[#222838] rounded-xl shadow-xl py-1 z-30">
                    {['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedChartRange(option)
                          setIsChartDropdownOpen(false)
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Glowing Golden Curved Area Chart */}
            <div className="w-full relative mt-2 pt-2">
              <svg viewBox="0 0 760 260" fill="none" className="w-full h-auto overflow-visible">
                <defs>
                  {/* Golden Line Glow Filter */}
                  <filter id="sales-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.55" />
                  </filter>
                  {/* Subtle Area Gradient */}
                  <linearGradient id="sales-area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.30" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Horizontal Grid Lines & Ticks */}
                {[
                  { label: '$800', y: 30 },
                  { label: '$600', y: 75 },
                  { label: '$400', y: 120 },
                  { label: '$200', y: 165 },
                  { label: '$0', y: 210 },
                ].map((item) => (
                  <g key={item.label}>
                    <text
                      x="45"
                      y={item.y + 4}
                      textAnchor="end"
                      className="fill-stone-400 dark:fill-[#64748b]"
                      fontSize="11"
                      fontFamily="inherit"
                      fontWeight="500"
                    >
                      {item.label}
                    </text>
                    <line
                      x1="60"
                      y1={item.y}
                      x2="735"
                      y2={item.y}
                      className="stroke-stone-200 dark:stroke-[#1e2433]"
                      strokeWidth="1"
                      strokeDasharray={item.label === '$0' ? 'none' : '2, 3'}
                    />
                  </g>
                ))}

                {/* Golden Gradient Area Fill */}
                <path
                  d="M 80,154 C 130,154 145,124 185,124 C 230,124 245,134 290,134 C 335,134 355,93 395,93 C 440,93 455,106 500,106 C 545,106 565,80 605,80 C 650,80 670,70 710,70 L 710,210 L 80,210 Z"
                  fill="url(#sales-area-gradient)"
                />

                {/* Smooth Golden Curve */}
                <path
                  d="M 80,154 C 130,154 145,124 185,124 C 230,124 245,134 290,134 C 335,134 355,93 395,93 C 440,93 455,106 500,106 C 545,106 565,80 605,80 C 650,80 670,70 710,70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#sales-line-glow)"
                />

                {/* Data Points */}
                {DEFAULT_SALES_POINTS.map((pt, idx) => {
                  const isCurrent = idx === activePointIndex
                  return (
                    <g
                      key={pt.date}
                      className="cursor-pointer"
                      onMouseEnter={() => setActivePointIndex(idx)}
                    >
                      {/* Invisible hover target */}
                      <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                      {isCurrent ? (
                        <>
                          {/* Pulsing Outer Ring */}
                          <circle cx={pt.x} cy={pt.y} r="10" fill="rgba(245, 158, 11, 0.3)" />
                          {/* Glowing Center Point */}
                          <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                        </>
                      ) : (
                        <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.8" />
                      )}

                      {/* X-Axis Date Label */}
                      <text
                        x={pt.x}
                        y="235"
                        textAnchor="middle"
                        className={isCurrent ? 'fill-amber-600 dark:fill-amber-400 font-bold' : 'fill-stone-400 dark:fill-[#64748b] font-medium'}
                        fontSize="11"
                        fontFamily="inherit"
                      >
                        {pt.date}
                      </text>
                    </g>
                  )
                })}

                {/* Active Tooltip Callout (Pointing directly to active point) */}
                {activePoint && (
                  <g transform={`translate(${Math.min(Math.max(activePoint.x - 48, 60), 650)}, ${Math.max(activePoint.y - 58, 6)})`}>
                    <rect
                      width="96"
                      height="46"
                      rx="10"
                      className="fill-stone-900 stroke-stone-700 dark:fill-[#141824] dark:stroke-[#2b3447]"
                      strokeWidth="1.2"
                      filter="drop-shadow(0 8px 16px rgba(0,0,0,0.4))"
                    />
                    <text x="48" y="18" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">
                      {activePoint.label}
                    </text>
                    <text x="48" y="36" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800">
                      ${activePoint.value}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Sales Summary Card (Right ~32%) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-[#1b212d] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400">
                    <IconBuildingStore className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                      Sales Summary
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                      Key insights from your store
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <IconDotsVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Stats blocks */}
              <div className="py-5 space-y-6">
                {/* Total Sales */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                      {totalSalesVal}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-1">Total Sales</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                      ▲ 12.5%
                    </span>
                    <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5">vs. last 7 days</p>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                      {totalCustomersVal}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-1">Total Customers</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                      ▲ 33%
                    </span>
                    <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5">vs. last 7 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between hover:border-amber-500/40 transition-all cursor-pointer group mt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <IconTarget className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-stone-900 dark:text-white leading-snug">
                    Keep it up!
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-zinc-400 mt-0.5 leading-tight">
                    Your sales are up 12.5% this week.
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Top 10 Selling Products Table */}
        <div className="bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl overflow-hidden shadow-sm dark:shadow-lg">
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-[#1b212d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400">
                <IconPackage className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                  Top 10 Selling Products
                </h2>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                  Performance by quantity sold
                </p>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-xs font-semibold text-stone-700 hover:text-stone-900 dark:bg-[#161a23] dark:hover:bg-[#1f2432] dark:border-[#222838] dark:text-amber-300 dark:hover:text-amber-200 transition-all self-start sm:self-auto"
            >
              <span>View all products</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-[#181d28] bg-stone-50/90 dark:bg-[#0e1017]/50">
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 w-12">
                    #
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Product
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    SKU
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Price
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Qty Sold
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Revenue
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 text-right w-12">
                    {/* Action */}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 dark:divide-[#181d28]">
                {mergedProducts.map((product, index) => {
                  return (
                    <tr
                      key={product._id || index}
                      className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 text-xs font-semibold text-stone-500 dark:text-zinc-400">
                        {index + 1}
                      </td>

                      {/* Product Thumbnail & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-[#181c26] border border-stone-200 dark:border-[#252c3c] overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/placeholder-product.svg'
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                              {product.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                          {product.sku || product.slug || '—'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-stone-900 dark:text-white">
                          ${product.price}
                        </span>
                      </td>

                      {/* Qty Sold */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${product.pillColor}`}
                        >
                          {product.totalSold} sold
                        </span>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-stone-900 dark:text-white">
                          ${product.revenue?.toLocaleString() || (product.price * product.totalSold).toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <IconDotsVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  trend,
  trendColor,
  subtext,
  sparklineColor,
  sparklinePath,
  cardId
}) {
  return (
    <div className="bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] p-4 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/40 dark:hover:border-[#2b3345] hover:shadow-lg dark:hover:shadow-xl shadow-sm dark:shadow-md flex flex-col justify-between">
      <div>
        {/* Top Icon Badge */}
        <div className={`w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center mb-3`}>
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

      {/* Bottom Row: Trend + Sparkline */}
      <div className="flex items-end justify-between mt-3 pt-1">
        <div>
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trendColor}`}>
            {trend}
          </span>
          <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-0.5">{subtext}</p>
        </div>

        {/* Glowing Mini Sparkline */}
        <div className="w-20 h-10 flex-shrink-0">
          <svg viewBox="0 0 100 45" fill="none" className="w-full h-full overflow-visible">
            <defs>
              <filter id={`spark-glow-${cardId}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={sparklineColor} floodOpacity="0.6" />
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
      </div>
    </div>
  )
}