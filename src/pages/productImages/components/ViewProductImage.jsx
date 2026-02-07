import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useGetSingleProductImageQuery } from "../../../redux/features/productImages/productImageApi";

export default function ViewProductImage({ targetID }) {
    const { data: productImage, isLoading } = useGetSingleProductImageQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                {productImage?.image && <Image imgLink={productImage?.image} imgAlt={productImage?.product} />}
            </div>
            <div className="space-y-4">
                <TitleDescription title="Serial" description={productImage?.serial} />
                <TitleDescription title="Product" description={productImage?.product?.title || 'N/A'} />
            </div>
        </div>
    );
}
