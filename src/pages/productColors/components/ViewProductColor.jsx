import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useSingleProductColorQuery } from "../../../redux/features/productColors/productColorApi";

export default function ViewProductColor({ targetID }) {
    const { data: productColor, isLoading } = useSingleProductColorQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto space-y-4">
            <TitleDescription
                title="Master Color"
                description={productColor?.color?.name ? `${productColor.color.name} (${productColor.color.hexCode})` : 'N/A'}
            />
            <TitleDescription title="Serial" description={productColor?.serial} />
            <TitleDescription title="Product" description={productColor?.product?.title || 'N/A'} />
        </div>
    );
}
