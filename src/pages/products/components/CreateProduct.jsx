import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProductMutation } from "../../../redux/features/products/productApi";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import { productFormSchema } from "../utils/productFormSchema";
import { Form } from '@/components/ui/form';
import { useGetCategoriesQuery } from "../../../redux/features/categories/categoryApi";
import { useGetSubcategoriesQuery } from "../../../redux/features/subcategories/subcategoryApi";
import SearchSelectField from "../../../components/ui/searchableSelect";
import { RichTextInput } from "../../../components/custom/RichTextInput";


export default function CreateProduct({ setShowCreateForm, refetch }) {

    const [createProduct] = useCreateProductMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");

    const { data: categoryData } = useGetCategoriesQuery({ queryParams: { currentPage: 1, limit: 200 } });
    const categories = categoryData?.documents || [];

    const { data: subcategoryData, refetch: refetchSubcategories } = useGetSubcategoriesQuery({
        queryParams: { currentPage: 1, limit: 200, category: category }
    }, { skip: !category });

    const subcategories = subcategoryData?.documents || [];

    useEffect(() => {
        if (category) {
            refetchSubcategories();
            setSubCategory(""); // Reset subcategory when category changes
        }
    }, [category, refetchSubcategories]);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            sku: '',
            title: "",
            description: "",
            price: '',
            quantity: '',
            image: "",
            isFeatured: false,
            isActive: true,
        }

    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + `-${Math.random().toString(36).substring(2, 7)}`;

        const formData = new FormData();
        formData.append("sku", data.sku);
        formData.append("title", data.title);
        formData.append("slug", slug);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("quantity", data.quantity);
        formData.append("category", category);
        if (subCategory) formData.append("subCategory", subCategory);
        if (image) formData.append("image", image);

        const result = await createProduct(formData);

        if (result.data) {
            await refetch();
            toast.success("Product created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        }
        if (result.error?.status === 400) {
            toast.error(result.error.data.message || "Failed to create product");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <InputField control={form.control} name="sku" label="SKU" />
                        <InputField control={form.control} name="title" label="Product Title" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SearchSelectField
                                label="Category"
                                value={category}
                                optionLabel="name"
                                optionValue="_id"
                                options={categories}
                                placeholder="Select Category"
                                setState={setCategory}
                            />
                            <SearchSelectField
                                label="Subcategory"
                                value={subCategory}
                                optionLabel="name"
                                optionValue="_id"
                                options={subcategories}
                                placeholder="Select Subcategory"
                                setState={setSubCategory}
                                disabled={!category}
                            />
                        </div>

                        <RichTextInput
                            label="Description"
                            name="description"
                            register={form.register}
                            control={form.control}
                            required
                            errors={form.formState.errors}
                            placeholder="Write your product description..."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField control={form.control} name="price" label="Price" />
                            <InputField control={form.control} name="quantity" label="Quantity" />
                        </div>
                        <ImageInput fieldId="image" state={image} setState={setImage} allowCreateImage>
                            Upload Image
                        </ImageInput>
                        <Button loading={isLoading}>Create Product</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
