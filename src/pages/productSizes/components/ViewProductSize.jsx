import Loader from "../../../components/Shared/loader/loader";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useGetSingleProductSizeQuery } from "../../../redux/features/productSizes/productSizeApi";

export default function ViewProductSize({ targetID }) {
    const { data: productSize, isLoading } = useGetSingleProductSizeQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleDescription
                title="Master Size"
                description={productSize?.size?.size ? `${productSize.size.size} (${productSize.size.gender})` : 'N/A'}
            />
            <TitleDescription title="Serial" description={productSize?.serial} />
            <TitleDescription title="Product" description={productSize?.product?.title || 'N/A'} />
        </div>
    );
}
