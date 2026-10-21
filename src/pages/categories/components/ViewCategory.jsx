
import DetailsSkeleton from "@/components/Shared/DetailsSkeleton/DetailsSkeleton";
import { Image } from "../../../components/Shared/Image/Image";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { useSingleCategoryQuery } from "../../../redux/features/categories/categoryApi";

export default function ViewCategory({ targetID }) {
    const { data: category, isLoading } = useSingleCategoryQuery({ id: targetID });

    if (isLoading) return <DetailsSkeleton count={2} hasImage={true} />;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleDescription title="Category Name" description={category?.name} />
            <TitleDescription title="Description" description={category?.description} />
            {category?.image && <Image imgLink={category.image} imgAlt={category.name} />}
        </div>
    );
}

