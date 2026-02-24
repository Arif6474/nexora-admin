import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandFormSchema } from "../utils/brandFormSchema";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { useSingleBrandQuery, useUpdateBrandMutation } from "../../../redux/features/brands/brandApi";
import { Form } from '@/components/ui/form';

export default function UpdateBrand({ setShowUpdateForm, refetch, targetID }) {
    const [updateBrand] = useUpdateBrandMutation();
    const { data: brand, isLoading: brandLoading, refetch: refetchBrand } = useSingleBrandQuery({ id: targetID });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState("");
    const form = useForm({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: brand?.name || "",
            description: brand?.description || "",
        },
    });

    useEffect(() => {
        if (brand) {
            form.reset({
                name: brand.name,
                description: brand.description,
            });
            setImage(brand?.image || "");
        }
    }, [brand, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("slug", slug);
        formData.append("description", data.description);
        if (image) formData.append("image", image);

        const result = await updateBrand({ id: targetID, updatedData: formData });

        if (result.data) {
            await refetchBrand();
            refetch();
            toast.success("Brand updated successfully!");
        }

        setIsSubmitting(false);
        setShowUpdateForm(false);
    };

    if (brandLoading) {
        return <Loader height="30dvh" />;
    }

    return (
        <div>
            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Brand Name"
                            placeholder="Enter brand name"
                        />
                        <InputField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Brand description"
                        />
                        <ImageInput
                            fieldId="image"
                            fieldName="image"
                            state={image}
                            setState={setImage}
                            allowUpdateImage
                        >
                            Upload Image
                        </ImageInput>
                        <Button className="mt-2" loading={isSubmitting}>
                            Update Brand
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
