import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, } from "../utils/categoryFormSchema"; // You can define your Zod schema
import { useCreateCategoryMutation } from "../../../redux/features/categories/categoryApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField"; // Reuse the InputField component
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";

export default function CreateCategory({ setShowCreateForm, refetch }) {
    const [createCategory] = useCreateCategoryMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(categoryFormSchema), 
        defaultValues: {
            name: '',
            description: '',
        },
    });

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
        if (image) formData.append("image", image);

        const result = await createCategory(formData);

        if (result.data) {
            refetch();
            toast.success("Category created successfully!");
            setIsLoading(false);
            setShowCreateForm(false); // Close the form after creation
        }
        if (result.error?.status === 400) {
            toast.error(result.error.data.message || "Failed to create category");
            setIsLoading(false);
        }
    };

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
                            allowCreateImage
                        >
                            Upload Image
                        </ImageInput>
                        <Button className="mt-2" loading={isLoading}>
                            Create Category
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
