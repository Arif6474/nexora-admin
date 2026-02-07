
import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";

import { useGetSingleOrderQuery } from "../../../redux/features/orders/orderApi";

export default function ViewOrder({ targetID }) {
    const { data: order, isLoading } = useGetSingleOrderQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;
    const singleOrder = order?.order;

    return (
        <div>
            <TitleDescription title="Order Items" className="mt-4" />
            <TitleDescription title="" />
            <div className="w-full">
                <div className="grid grid-cols-5 gap-4 ">
                    <p className="text-muted-foreground pt-2">Item</p>
                    <p className="text-muted-foreground pt-2">Image</p>
                    <p className="text-muted-foreground pt-2">Price</p>
                    <p className="text-muted-foreground pt-2">Quantity</p>
                    <p className="text-muted-foreground pt-2 text-right max-w-[80px]">Total</p>
                </div>
                {singleOrder?.products.map((item) => (
                    <div key={item._id} className="grid grid-cols-5 gap-4 py-4 border-b-[.5px] border-muted-foreground/50">
                        <p className="text-muted-foreground pt-2">{item.item.title}</p>
                        {item?.item.image && <Image imgLink={item.item.image} imgAlt={item.item.title} className='w-12' />}
                        <p className="text-muted-foreground pt-2">{item.unitPrice}</p>
                        <p className="text-muted-foreground pt-2">{item.quantity}</p>
                        <p className="text-muted-foreground pt-2 text-right max-w-[80px]">{item.totalPrice}</p>
                    </div>
                ))}
                <div className="grid grid-cols-5 gap-4 py-4 ">
                    <p className="text-muted-foreground pt-2">Subtotal</p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2 text-right max-w-[80px]">{singleOrder?.products.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
                </div>
                <div className="grid grid-cols-5 gap-4 border-b-[.5px] border-muted-foreground/50  ">
                    <p className="text-muted-foreground pt-2">Shipping Rate</p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2 text-right max-w-[80px]">0</p>
                </div>
                <div className="grid grid-cols-5 gap-4 py-4 border-b-[.5px] border-muted-foreground/50 ">
                    <p className="text-muted-foreground pt-2">Total Amount</p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2"></p>
                    <p className="text-muted-foreground pt-2 text-right max-w-[80px]">{singleOrder?.totalAmount}</p>
                </div>
            </div>
            <div className="pt-4 max-h-[90vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                <TitleDescription title="Order ID" description={singleOrder?.orderId} />
                <TitleDescription title="Total Amount" description={singleOrder?.totalAmount} />
                <TitleDescription title="Customer Name" description={singleOrder?.customer.name} />
                <TitleDescription title="Phone" description={singleOrder?.customer.phone} />
                <TitleDescription title="Shipping Details:" className="mt-4" />
                <TitleDescription title="" />
                <TitleDescription title="Recipient Name" description={singleOrder?.shippingDetails.recipientName} />
                <TitleDescription title="Phone" description={singleOrder?.shippingDetails.phone} />
                <TitleDescription title="email" description={singleOrder?.shippingDetails.email} />
                <TitleDescription title="Address" description={singleOrder?.shippingDetails.address} />
                <TitleDescription title="City" description={singleOrder?.shippingDetails.city} />
                <TitleDescription title="Area" description={singleOrder?.shippingDetails.area} />
                <TitleDescription title="Order Status" description={singleOrder?.orderStatus} />
                <TitleDescription title="Payment Method" description={singleOrder?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} />
                <TitleDescription title="Date" description={new Date(singleOrder?.createdAt).toLocaleDateString()} />

            </div>
        </div>
    );
}

