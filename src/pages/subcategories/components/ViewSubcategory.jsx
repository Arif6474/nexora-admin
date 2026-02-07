
import Loader from "../../../components/Shared/loader/loader";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useSingleSubcategoryQuery } from "../../../redux/features/subcategories/subcategoryApi";

export default function ViewSubcategory({ targetID }) {
    const { data: subcategory, isLoading } = useSingleSubcategoryQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleDescription title="Subcategory Name" description={subcategory?.name} />
            <TitleDescription title="Parent Category" description={subcategory?.category?.name} />
            <TitleDescription title="Description" description={subcategory?.description} />
            {subcategory?.image && <Image imgLink={subcategory.image} imgAlt={subcategory.name} />}
        </div>
    );
}

