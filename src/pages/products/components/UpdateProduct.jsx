import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "../utils/productFormSchema";
import { useSingleProductQuery, useUpdateProductMutation } from "../../../redux/features/products/productApi";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { Form } from "@/components/ui/form";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categoryApi";
import { useGetSubcategoriesQuery } from "../../../redux/features/subcategories/subcategoryApi";
import SearchSelectField from "../../../components/ui/searchableSelect";
import { RichTextInput } from "../../../components/custom/RichTextInput";
import SelectField from "@/components/custom/SelectField";

export default function UpdateProduct({ setShowUpdateForm, refetch, targetID }) {

    const [updateProduct] = useUpdateProductMutation();
    const { data: product, isLoading: productLoading, refetch: productRefetch } = useSingleProductQuery({ id: targetID });

    const [isSubmitting, setIsSubmitting] = useState(false);
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
        }
    }, [category, refetchSubcategories]);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            sku: product?.sku || "",
            title: product?.title || "",
            description: product?.description || "",
            price: product?.price || "",
            quantity: product?.quantity || "",
            category: category || "",
            subCategory: subCategory || "",
            isFeatured: product?.isFeatured || false,
            gender: product?.gender || 'Unisex',
            discount: product?.discount?.toString() || '0',
        }
    });

    useEffect(() => {
        if (product) {
            form.reset({
                sku: product.sku,
                title: product.title,
                description: product.description,
                price: product.price.toString(),
                quantity: product.quantity.toString(),
                isFeatured: product.isFeatured,
                gender: product.gender,
                discount: product.discount?.toString() || '0',
            });
            setImage(product.image);
            setCategory(product.category?._id || "");
            setSubCategory(product.subCategory?._id || product.subCategory || "");
        }
    }, [product, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
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
        formData.append("gender", data.gender);
        formData.append("discount", data.discount);
        if (subCategory) formData.append("subCategory", subCategory);
        if (image && typeof image !== "string") formData.append("image", image);

        const result = await updateProduct({ id: targetID, updatedData: formData });

        if (result.data) {

            await refetch();
            await productRefetch();
            toast.success("Product updated successfully!");
            setShowUpdateForm(false);

        } else if (result.error) {
            setIsSubmitting(false);
            toast.error(result.error.data?.message || "Failed to update product");
        }
        setIsSubmitting(false);
    };

    if (productLoading) {
        return <Loader height="30dvh" />;
    }

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
                                setState={(selectedCategory) => {
                                    setCategory(selectedCategory);
                                    setSubCategory("");
                                }}
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
                            <InputField control={form.control} name="discount" label="Discount (%)" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField control={form.control} name="quantity" label="Quantity" />
                            <SelectField
                                control={form.control}
                                name="gender"
                                label="Gender"
                                options={[
                                    { label: 'Men', value: 'Men' },
                                    { label: 'Women', value: 'Women' },
                                    { label: 'Unisex', value: 'Unisex' },
                                    { label: 'Kids', value: 'Kids' },
                                ]}
                            />
                        </div>
                        <ImageInput fieldId="image" state={image} setState={setImage} allowUpdateImage>
                            Upload Image
                        </ImageInput>
                        <Button loading={isSubmitting}>Update Product</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
