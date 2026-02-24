import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useSingleBrandQuery } from "../../../redux/features/brands/brandApi";

export default function ViewBrand({ targetID }) {
    const { data: brand, isLoading } = useSingleBrandQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleDescription title="Brand Name" description={brand?.name} />
            <TitleDescription title="Description" description={brand?.description} />
            {brand?.image && <Image imgLink={brand.image} imgAlt={brand.name} />}
        </div>
    );
}
