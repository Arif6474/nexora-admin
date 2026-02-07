import { useSingleProductQuery } from "../../../redux/features/products/productApi";
import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";

export default function ViewProduct({ targetID }) {
    const { data: product, isLoading } = useSingleProductQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleDescription title="Product Title" description={product?.title} />
            <TitleDescription title="Gender" description={product?.gender} />
            <TitleDescription title="Price" description={`$${product?.price}`} />
            <TitleDescription title="Discount" description={`${product?.discount || 0}%`} />
            <TitleDescription title="Quantity" description={product?.quantity} />
            {product?.image && <Image imgLink={product.image} imgAlt={product.title} />}
        </div>
    );
}
