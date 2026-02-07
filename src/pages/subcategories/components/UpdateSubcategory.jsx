import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoryFormSchema } from "../utils/subcategoryFormSchema";
import { useSingleSubcategoryQuery, useUpdateSubcategoryMutation } from "@/redux/features/subcategories/subcategoryApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import { IconLoader, IconX } from "@tabler/icons-react";

export default function UpdateSubcategory({ setShowUpdateForm, targetID, refetch }) {
    const [updateSubcategory] = useUpdateSubcategoryMutation();
    const { data: subcategoryData, isLoading: isFetching } = useSingleSubcategoryQuery({ id: targetID });

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (subcategoryData) {
            form.setValue('name', subcategoryData.name);
            form.setValue('description', subcategoryData.description);
            setImage(subcategoryData.image);
        }
    }, [subcategoryData, form]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", slug);
        formData.append("description", data.description);

        if (image && typeof image !== 'string') {
            formData.append("image", image);
        }

        const result = await updateSubcategory({ id: targetID, updatedData: formData });

        if (result.data) {
            refetch();
            toast.success("Subcategory updated successfully!");
            setIsLoading(false);
            setShowUpdateForm(false);
        }
        if (result.error?.status === 400) {
            toast.error(result.error.data.message || "Failed to update subcategory");
            setIsLoading(false);
        }
    };

    if (isFetching) return (
        <div className="h-full w-full max-w-md bg-background p-6 flex items-center justify-center">
            <IconLoader className="animate-spin" />
        </div>
    );

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Subcategory Name"
                            placeholder="Enter subcategory name"
                        />
                        <InputField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Subcategory description"
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
                        <Button className="mt-2" loading={isLoading}>
                            Update Subcategory
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
