import { useState, useEffect } from 'react';
import {
  IconPackage,
  IconShoppingBag,
  IconReceipt,
  IconUser,
  IconClock,
  IconTruck,
  IconMapPin,
  IconCopy,
  IconCheck,
  IconPrinter,
  IconDownload,
  IconDots,
  IconChevronDown,
  IconCreditCard,
  IconCash,
  IconX,
  IconAlertTriangle,
  IconLoader2,
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import Loader from '../../../components/Shared/loader/loader';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import {
  useGetSingleOrderQuery,
  useUpdateOrderStatusByIdMutation,
} from '../../../redux/features/orders/orderApi';

export default function ViewOrder({ targetID, setShowItem, refetch }) {
  const { data: order, isLoading, refetch: refetchSingleOrder } = useGetSingleOrderQuery({ id: targetID });
  const [updateOrderStatus] = useUpdateOrderStatusByIdMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const singleOrder = order?.order;

  // Keep localStatus in sync whenever server data updates
  useEffect(() => {
    if (singleOrder?.orderStatus) {
      setLocalStatus(singleOrder.orderStatus);
    }
  }, [singleOrder?.orderStatus]);

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader height="30dvh" />
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="p-8 text-center text-stone-500 dark:text-zinc-400">
        No order details found.
      </div>
    );
  }

  // Extract variables with fallbacks matching reference
  const orderId = singleOrder.orderId || targetID || 'SM171026UXV7I';
  const orderStatus = localStatus || singleOrder.orderStatus || 'Pending';
  const products = singleOrder.products || [];

  // Formatting date
  const orderDate = singleOrder.createdAt ? new Date(singleOrder.createdAt) : new Date();
  const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(orderDate);

  const formattedDateOnly = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(orderDate);

  const formattedTimeOnly = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(orderDate);

  // Financial calculations
  const subtotal =
    products.reduce(
      (acc, item) =>
        acc +
        (Number(item.totalPrice) ||
          Number(item.unitPrice || 0) * Number(item.quantity || 1)),
      0
    ) || 0;
  const shippingRate = Number(singleOrder.shippingRate) || 0;
  const totalAmount =
    Number(singleOrder.totalAmount) || subtotal + shippingRate;

  // Customer & Shipping
  const customerName =
    singleOrder.customer?.name ||
    singleOrder.shippingDetails?.recipientName ||
    'ant tech';
  const customerEmail =
    singleOrder.customer?.email ||
    singleOrder.shippingDetails?.email ||
    'anttech@example.com';
  const customerPhone =
    singleOrder.customer?.phone || singleOrder.shippingDetails?.phone || '—';

  const recipientName =
    singleOrder.shippingDetails?.recipientName || customerName;
  const recipientPhone =
    singleOrder.shippingDetails?.phone || customerPhone || '+8809283423424';
  const addressLine =
    singleOrder.shippingDetails?.address || '123 Main Street';
  const cityLine = singleOrder.shippingDetails?.city || 'Mestre, Venezia';
  const areaLine = singleOrder.shippingDetails?.area || 'Italy, 30171';

  const paymentMethodLabel =
    singleOrder.paymentMethod === 'cod'
      ? 'Cash on Delivery'
      : singleOrder.paymentMethod
      ? singleOrder.paymentMethod.toUpperCase()
      : 'Cash on Delivery';

  // Status progression
  const standardStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = standardStatuses.indexOf(orderStatus);

  // Status color tags
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500',
        };
      case 'Processing':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500',
        };
      case 'Shipped':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400',
          dot: 'bg-indigo-500',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500',
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400',
          dot: 'bg-rose-500',
        };
      default:
        return {
          bg: 'bg-stone-500/10 border-stone-500/30 text-stone-700 dark:text-stone-300',
          dot: 'bg-stone-500',
        };
    }
  };

  const statusBadge = getStatusBadge(orderStatus);

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Status update mutation
  const handleUpdateStatus = async (newStatus) => {
    if (!newStatus || newStatus === orderStatus) return;
    const previousStatus = orderStatus;
    // Instant optimistic UI update
    setLocalStatus(newStatus);
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus({
        id: targetID,
        updatedData: { orderStatus: newStatus },
      });
      if (result?.data) {
        toast.success(`Order marked as ${newStatus}`);
        refetchSingleOrder?.();
        refetch?.();
      } else {
        setLocalStatus(previousStatus);
        toast.error(result?.error?.data?.message || 'Failed to update status');
      }
    } catch {
      setLocalStatus(previousStatus);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Next status action
  const getNextAction = () => {
    switch (orderStatus) {
      case 'Pending':
        return { label: 'Mark as Shipped', nextStatus: 'Shipped' };
      case 'Processing':
        return { label: 'Mark as Shipped', nextStatus: 'Shipped' };
      case 'Shipped':
        return { label: 'Mark as Delivered', nextStatus: 'Delivered' };
      case 'Delivered':
        return { label: 'Order Completed', nextStatus: null };
      default:
        return { label: 'Mark as Processing', nextStatus: 'Processing' };
    }
  };

  const nextAction = getNextAction();

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Download invoice as PDF
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    const toastId = toast.loading('Generating PDF invoice...');
    try {
      const doc = new jsPDF('p', 'mm', 'a4');

      // Brand & Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('NEXORA', 15, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Official Order Invoice & Receipt', 15, 28);

      // Order ID & Date
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(217, 119, 6);
      doc.text(`Order #${orderId}`, 195, 20, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${formattedDateTime}`, 195, 26, { align: 'right' });

      // Status Badge
      const statusColors = {
        Pending: { bg: [254, 243, 199], text: [180, 83, 9] },
        Processing: { bg: [219, 234, 254], text: [29, 78, 216] },
        Shipped: { bg: [224, 231, 255], text: [67, 56, 202] },
        Delivered: { bg: [209, 250, 229], text: [4, 120, 87] },
        Cancelled: { bg: [255, 228, 230], text: [190, 18, 60] },
      };
      const badgeStyle = statusColors[orderStatus] || {
        bg: [241, 245, 249],
        text: [71, 85, 105],
      };

      doc.setFillColor(...badgeStyle.bg);
      doc.roundedRect(165, 30, 30, 6, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...badgeStyle.text);
      doc.text(String(orderStatus).toUpperCase(), 180, 34.2, { align: 'center' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, 40, 195, 40);

      // Info Boxes
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(15, 45, 87, 36, 3, 3, 'FD');
      doc.roundedRect(108, 45, 87, 36, 3, 3, 'FD');

      // Customer Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('CUSTOMER INFORMATION', 20, 52);

      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const safeCustomerName = doc.splitTextToSize(String(customerName || 'Customer'), 77);
      doc.text(safeCustomerName, 20, 58);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Email: ${customerEmail || '—'}`, 20, 65);
      doc.text(`Phone: ${customerPhone || '—'}`, 20, 71);

      // Shipping Details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('SHIPPING DETAILS', 113, 52);

      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const safeRecipientName = doc.splitTextToSize(String(recipientName || customerName), 77);
      doc.text(safeRecipientName, 113, 58);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const safeAddress = doc.splitTextToSize(String(addressLine || ''), 77);
      doc.text(safeAddress, 113, 65);
      doc.text(`${cityLine || ''}, ${areaLine || ''}`, 113, 71);
      doc.text(`Phone: ${recipientPhone || '—'}`, 113, 77);

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(15, 87, 180, 8, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('ITEM DESCRIPTION', 20, 92.2);
      doc.text('PRICE', 120, 92.2, { align: 'center' });
      doc.text('QTY', 150, 92.2, { align: 'center' });
      doc.text('TOTAL', 190, 92.2, { align: 'right' });

      // Rows
      let curY = 102;
      products.forEach((p, idx) => {
        if (curY > 255) {
          doc.addPage();
          curY = 20;
        }

        const title = p.product?.title || 'Product Item';
        const sku = p.product?.sku || `SKU: ITEM-${idx + 100}`;
        const price = Number(p.unitPrice) || 0;
        const qty = Number(p.quantity) || 1;
        const rowTotal = Number(p.totalPrice) || price * qty;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        const titleLines = doc.splitTextToSize(String(title), 92);
        doc.text(titleLines, 20, curY);

        const titleOffset = titleLines.length * 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(sku, 20, curY + titleOffset);

        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`$${price}`, 120, curY + 2, { align: 'center' });
        doc.text(String(qty), 150, curY + 2, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`$${rowTotal}`, 190, curY + 2, { align: 'right' });

        const rowHeight = titleOffset + 8;
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.3);
        doc.line(15, curY + rowHeight, 195, curY + rowHeight);
        curY += rowHeight + 5;
      });

      // Summary Box
      if (curY > 240) {
        doc.addPage();
        curY = 20;
      }
      const summaryY = curY + 3;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(118, summaryY, 77, 26, 3, 3, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal:', 124, summaryY + 6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`$${subtotal}`, 190, summaryY + 6, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Shipping Rate:', 124, summaryY + 12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`$${shippingRate}`, 190, summaryY + 12, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.line(124, summaryY + 16, 190, summaryY + 16);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Total Amount:', 124, summaryY + 22);

      doc.setFontSize(12);
      doc.setTextColor(217, 119, 6);
      doc.text(`$${totalAmount}`, 190, summaryY + 22, { align: 'right' });

      // Footer
      const footerY = summaryY + 36;
      doc.setDrawColor(241, 245, 249);
      doc.line(15, footerY, 195, footerY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Payment Method: ${paymentMethodLabel}`, 105, footerY + 6, { align: 'center' });
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for shopping with Nexora. For inquiries, contact support@nexora.com', 105, footerY + 11, { align: 'center' });

      doc.save(`Invoice_${orderId}.pdf`);
      toast.success('Invoice PDF downloaded!', { id: toastId });
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Failed to generate PDF invoice', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Image link resolver
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    const base = import.meta.env.VITE_REACT_APP_SPACES_URL || '';
    return `${base}${img}`;
  };

  return (
    <div className="p-5 sm:p-7 md:p-8 space-y-6 text-stone-900 dark:text-stone-100 max-w-full">
      {/* ============================================================ */}
      {/* TOP HEADER: Order Details + Status Pill                      */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 pr-8">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm flex-shrink-0">
            <IconPackage className="w-6 h-6" stroke={1.8} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white">
              Order Details
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-stone-500 dark:text-zinc-400">
              <span className="font-semibold text-stone-700 dark:text-zinc-300">
                Order #{orderId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(orderId, 'Order ID')}
                className="p-1 hover:bg-stone-200/60 dark:hover:bg-zinc-800 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition-colors"
                title="Copy Order ID"
              >
                <IconCopy size={13} />
              </button>
              <span className="text-stone-300 dark:text-zinc-700 hidden sm:inline">•</span>
              <span className="text-stone-500 dark:text-zinc-400">
                Placed on {formattedDateTime}
              </span>
            </div>
          </div>
        </div>

        {/* Quick status dropdown / badge */}
        <div className="self-start sm:self-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${statusBadge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                <span>{orderStatus}</span>
                <IconChevronDown size={14} className="opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-white dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] p-1.5 rounded-xl shadow-xl"
            >
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center justify-between ${
                      orderStatus === status
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                        : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{status}</span>
                    {orderStatus === status && <IconCheck size={14} />}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2-COLUMN MAIN CONTENT: Left (Items + Info) | Right (Timeline) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* ========================================================== */}
        {/* LEFT COLUMN: ~60% (7 of 12 columns)                        */}
        {/* ========================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Order Items */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <IconShoppingBag size={15} />
              </div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                Order Items ({products.length})
              </h3>
            </div>

            {/* Items Table Headers */}
            <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 border-b border-stone-100 dark:border-[#1e2330] pb-2.5">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-stone-100 dark:divide-[#1e2330]">
              {products.map((item, idx) => {
                const imgUrl = getImageUrl(item?.product?.image);
                const title = item?.product?.title || 'Product Item';
                const sku =
                  item?.product?.sku ||
                  `SKU: ${title.toUpperCase().replace(/\s+/g, '-')}-${idx + 100}A`;
                const price = Number(item.unitPrice) || 0;
                const qty = Number(item.quantity) || 1;
                const rowTotal = Number(item.totalPrice) || price * qty;

                return (
                  <div
                    key={item._id || idx}
                    className="grid grid-cols-12 items-center py-3.5 gap-2"
                  >
                    {/* Item (image + title + SKU) */}
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-[#181d28] border border-stone-200/80 dark:border-[#222838] flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <IconShoppingBag className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                          {title}
                        </p>
                        <p className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 truncate mt-0.5">
                          {sku}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center text-sm font-bold text-stone-800 dark:text-zinc-200">
                      ${price}
                    </div>

                    {/* Quantity Pill */}
                    <div className="col-span-2 flex justify-center">
                      <span className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-[#181d28] border border-stone-200/60 dark:border-[#222838] text-xs font-bold text-stone-700 dark:text-zinc-300 min-w-[28px] text-center">
                        {qty}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-right text-sm font-extrabold text-stone-900 dark:text-white">
                      ${rowTotal}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Breakdown Box */}
            <div className="pt-3 border-t border-stone-100 dark:border-[#1e2330] space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900 dark:text-zinc-200">
                  ${subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-600 dark:text-zinc-400">
                <span>Shipping Rate</span>
                <span className="font-bold text-stone-900 dark:text-zinc-200">
                  ${shippingRate}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-[#1e2330] flex items-center justify-between">
                <span className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500 tracking-tight">
                  ${totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Cards 2 & 3: Order Info + Customer Info Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Information Card */}
            <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <IconReceipt size={15} />
                </div>
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                  Order Information
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Order ID
                  </span>
                  <div className="flex items-center gap-1 font-bold text-stone-900 dark:text-zinc-200">
                    <span className="truncate max-w-[140px]">{orderId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(orderId, 'Order ID')}
                      className="p-0.5 hover:text-amber-500 text-stone-400 transition-colors"
                    >
                      <IconCopy size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Order Date
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200">
                    {formattedDateOnly}, {formattedTimeOnly}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Payment Method
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-stone-900 dark:text-zinc-200">
                    {singleOrder.paymentMethod === 'cod' ? (
                      <IconCash size={14} className="text-amber-500" />
                    ) : (
                      <IconCreditCard size={14} className="text-amber-500" />
                    )}
                    {paymentMethodLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Order Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                    {orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <IconUser size={15} />
                </div>
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                  Customer Information
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Customer Name
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200">
                    {customerName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Email
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200 truncate max-w-[150px]">
                    {customerEmail}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Phone
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200">
                    {customerPhone}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 pt-1 border-t border-stone-100 dark:border-[#1e2330]">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium flex-shrink-0">
                    Shipping Address
                  </span>
                  <div className="flex items-start gap-1 font-semibold text-stone-800 dark:text-zinc-300 text-right">
                    <IconMapPin size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{addressLine}</p>
                      <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                        {cityLine}, {areaLine}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: ~40% (5 of 12 columns)                       */}
        {/* ========================================================== */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Card 4: Order Status Timeline */}
            <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <IconClock size={15} />
                </div>
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                  Order Status
                </h3>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="relative pl-1 py-1 space-y-6">
                {[
                  {
                    step: 'Pending',
                    title: 'Pending',
                    desc: 'Order has been placed',
                    time: `${formattedDateOnly}\n${formattedTimeOnly}`,
                  },
                  {
                    step: 'Processing',
                    title: 'Processing',
                    desc: 'Preparing items',
                  },
                  {
                    step: 'Shipped',
                    title: 'Shipped',
                    desc: 'On the way',
                  },
                  {
                    step: 'Delivered',
                    title: 'Delivered',
                    desc: 'Order completed',
                  },
                ].map((item, idx, arr) => {
                  const stepIndex = standardStatuses.indexOf(item.step);
                  const isCurrent = orderStatus === item.step;
                  const isPassed =
                    currentStatusIndex >= 0 && currentStatusIndex > stepIndex;
                  const isUpcoming =
                    currentStatusIndex === -1 || currentStatusIndex < stepIndex;

                  return (
                    <div key={item.step} className="relative flex items-start gap-3.5">
                      {/* Connecting Line */}
                      {idx < arr.length - 1 && (
                        <span
                          className={`absolute left-[9px] top-5 -bottom-6 w-0.5 transition-colors ${
                            isPassed
                              ? 'bg-amber-500'
                              : 'bg-stone-200 dark:bg-zinc-800'
                          }`}
                        />
                      )}

                      {/* Step Circle Marker */}
                      <div className="relative z-10 flex-shrink-0 mt-0.5">
                        {isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500 ring-4 ring-amber-500/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                          </div>
                        ) : isPassed ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm">
                            <IconCheck size={12} stroke={3} />
                          </div>
                        ) : (
                          <div className="w-4 h-4 ml-0.5 rounded-full bg-stone-200 dark:bg-zinc-700 border-2 border-white dark:border-[#12151c]" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-600 dark:text-amber-400'
                                : isPassed
                                ? 'text-stone-900 dark:text-zinc-200'
                                : 'text-stone-400 dark:text-zinc-500'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-[11px] font-medium text-stone-400 dark:text-zinc-500">
                            {item.desc}
                          </p>
                        </div>
                        {item.time && (
                          <span className="text-[10px] font-semibold text-stone-400 dark:text-zinc-500 text-right whitespace-pre-line leading-tight">
                            {item.time}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 5: Shipping Details */}
            <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <IconTruck size={15} />
                </div>
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                  Shipping Details
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Recipient Name
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200">
                    {recipientName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium">
                    Phone
                  </span>
                  <span className="font-bold text-stone-900 dark:text-zinc-200">
                    {recipientPhone}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 pt-1 border-t border-stone-100 dark:border-[#1e2330]">
                  <span className="text-stone-500 dark:text-zinc-400 font-medium flex-shrink-0">
                    Address
                  </span>
                  <div className="flex items-start gap-1 font-semibold text-stone-800 dark:text-zinc-300 text-right">
                    <IconMapPin size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{addressLine}</p>
                      <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                        {cityLine}
                      </p>
                      <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                        {areaLine}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-3 pt-2">
            {/* Utility Row: Print, Download, More */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-stone-200 dark:border-[#1f2533] bg-white dark:bg-[#12151c] text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-[#181d28] hover:text-stone-900 dark:hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <IconPrinter size={15} />
                <span>Print</span>
              </button>

              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadPdf}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-stone-200 dark:border-[#1f2533] bg-white dark:bg-[#12151c] text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-[#181d28] hover:text-stone-900 dark:hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isDownloading ? (
                  <IconLoader2 size={15} className="animate-spin text-amber-500" />
                ) : (
                  <IconDownload size={15} />
                )}
                <span>{isDownloading ? 'Generating...' : 'Download'}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 dark:border-[#1f2533] bg-white dark:bg-[#12151c] text-stone-600 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-[#181d28] hover:text-stone-900 dark:hover:text-white shadow-sm transition-all cursor-pointer flex-shrink-0"
                    title="More actions"
                  >
                    <IconDots size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] p-1.5 rounded-xl shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={() => handleCopy(orderId, 'Order ID')}
                    className="cursor-pointer text-xs rounded-lg flex items-center gap-2"
                  >
                    <IconCopy size={14} />
                    <span>Copy Order ID</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCopy(customerEmail, 'Customer Email')}
                    className="cursor-pointer text-xs rounded-lg flex items-center gap-2"
                  >
                    <IconUser size={14} />
                    <span>Copy Customer Email</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Primary Action Row: Cancel Order + Next Status Button */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                type="button"
                disabled={isUpdating || orderStatus === 'Cancelled'}
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 h-10.5 rounded-xl text-xs font-bold text-stone-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900/50 transition-colors"
              >
                Cancel Order
              </Button>

              {nextAction.nextStatus && (
                <Button
                  variant="gold"
                  type="button"
                  loading={isUpdating}
                  onClick={() => handleUpdateStatus(nextAction.nextStatus)}
                  className="flex-1 h-10.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/25"
                >
                  {nextAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="max-w-sm rounded-3xl p-6 bg-white dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] shadow-2xl">
          <div className="text-center space-y-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
              <IconAlertTriangle size={24} stroke={2} />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                Cancel Order?
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Are you sure you want to cancel order{' '}
                <span className="font-bold text-stone-900 dark:text-white">#{orderId}</span>?
                This action will mark the order as{' '}
                <span className="font-bold text-rose-500">Cancelled</span>.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 h-10 rounded-xl text-xs font-semibold"
              >
                Keep Order
              </Button>
              <Button
                type="button"
                variant="destructive"
                loading={isUpdating}
                onClick={async () => {
                  await handleUpdateStatus('Cancelled');
                  setShowCancelConfirm(false);
                }}
                className="flex-1 h-10 rounded-xl text-xs font-bold shadow-md shadow-rose-600/25"
              >
                Yes, Cancel Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
