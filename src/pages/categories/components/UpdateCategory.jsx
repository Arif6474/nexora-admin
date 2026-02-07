import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema } from "../utils/categoryFormSchema";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField"; // Reuse the InputField component
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { useSingleCategoryQuery, useUpdateCategoryMutation } from "../../../redux/features/categories/categoryApi";
import { Form } from '@/components/ui/form';

export default function UpdateCategory({ setShowUpdateForm, refetch, targetID }) {
    const [updateCategory] = useUpdateCategoryMutation();
    const { data: category, isLoading: categoryLoading, refetch: refetchCategory } = useSingleCategoryQuery({ id: targetID });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState("");
    const form = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
        },
    });

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description,
            });
            setImage(category?.image || "");
        }
    }, [category, form]);

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

        const result = await updateCategory({ id: targetID, updatedData: formData });

        if (result.data) {
            await refetchCategory();
            refetch();
            toast.success("Category updated successfully!");
        }

        setIsSubmitting(false);
        setShowUpdateForm(false); // Close the form after update
    };

    if (categoryLoading) {
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
                        label="Category Name"
                        placeholder="Enter category name"
                    />
                    <InputField
                        control={form.control}
                        name="description"
                        label="Description"
                        placeholder="Category description"
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
                        Update Category
                    </Button>
                </div>
            </form>
                 </Form>
        </div>
    );
}
