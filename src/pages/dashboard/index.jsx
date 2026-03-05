import { Layout } from "@/components/custom/layout"
import HeaderControls from "@/components/Shared/HeaderControls"
import { useGetDashboardStatsQuery } from "../../redux/features/dashboard/dashboardApi"
import { IconCurrencyDollar, IconClock, IconShoppingCart, IconPackage, IconUsers, IconTrendingUp } from "@tabler/icons-react"
import Loader from "../../components/Shared/loader/loader"

function Dashboad() {
  const { data, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) return <Loader height="70dvh" />

  const { stats, topSellingProducts } = data || {}

  return (
    <Layout>
      <HeaderControls isSearch />
      <div className="p-8 space-y-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-2">Dashboard Overview</h1>
          <p className="text-stone-500 font-medium">Real-time business insights and performance metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            title="Total Sales"
            value={`$${stats?.totalSales?.toLocaleString() || 0}`}
            icon={IconCurrencyDollar}
            description="Total revenue from delivered orders"
            color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.totalPendingOrders || 0}
            icon={IconClock}
            description="Orders awaiting processing"
            color="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
          />
          <StatCard
            title="Delivered Orders"
            value={stats?.totalDeliveredOrders || 0}
            icon={IconShoppingCart}
            description="Orders awaiting processing"
            color="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          />
          <StatCard
            title="Active Products"
            value={stats?.totalActiveProducts || 0}
            icon={IconPackage}
            description="Total products live in shop"
            color="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          />
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={IconUsers}
            description="Registered customer base"
            color="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
          />
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <IconTrendingUp className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">Top 10 Selling Products</h2>
              <p className="text-xs text-stone-500 font-medium uppercase tracking-widest mt-0.5">Performance by quantity sold</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 dark:bg-stone-800/20">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Product</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400 text-right">Qty Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
                {topSellingProducts?.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden flex-shrink-0">
                          <img
                            src={import.meta.env.VITE_REACT_APP_SPACES_URL + product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/placeholder-product.png'}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-stone-900 dark:text-stone-100">{product.title}</p>
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tight">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                        ${product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-black text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700">
                        {product.totalSold} sold
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ title, value, icon: Icon, description, color }) {
  return (
    <div className="bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm transition-all hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-black text-stone-500 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">{value}</p>
        <p className="text-xs text-stone-400 font-medium mt-2">{description}</p>
      </div>
    </div>
  )
}

export default Dashboad