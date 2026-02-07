import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoryFormSchema } from "../utils/subcategoryFormSchema";
import { useCreateSubcategoryMutation } from "@/redux/features/subcategories/subcategoryApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";

export default function CreateSubcategory({ setShowCreateForm, refetch, parentID }) {
    const [createSubcategory] = useCreateSubcategoryMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = async (data) => {
        if (!parentID) {
            toast.error("Category ID is missing");
            return;
        }

        setIsLoading(true);
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", slug);
        formData.append("description", data.description);
        formData.append("category", parentID); // Use ID from URL
        if (image) formData.append("image", image);

        const result = await createSubcategory(formData);

        if (result.data) {
            refetch();
            toast.success("Subcategory created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        }
        if (result.error?.status === 400) {
            toast.error(result.error.data.message || "Failed to create subcategory");
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
                            allowCreateImage
                        >
                            Upload Image
                        </ImageInput>
                        <Button className="mt-2" loading={isLoading}>
                            Create Subcategory
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
