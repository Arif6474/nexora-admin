import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productImageFormSchema } from "../utils/productImageFormSchema";
import { useGetSingleProductImageQuery, useUpdateProductImageMutation } from "../../../redux/features/productImages/productImageApi";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { Form } from "@/components/ui/form";

export default function UpdateProductImage({ setShowUpdateForm, refetch, targetID, parentID }) {
    const [updateProductImage] = useUpdateProductImageMutation();
    const { data: productImage, isLoading: productImageLoading, refetch: refetchProductImage } = useGetSingleProductImageQuery({ id: targetID });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(productImageFormSchema),
        defaultValues: {
            serial: '0',
        },
    });

    useEffect(() => {
        if (productImage) {
            form.reset({
                serial: productImage?.serial?.toString() || "0",
            });
            setImage(productImage?.image || "");
        }
    }, [productImage, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("product", parentID || productImage?.product);
        if (image) formData.append("image", image);
        formData.append("serial", data.serial);

        const result = await updateProductImage({ id: targetID, updatedData: formData });

        if (result.data) {
            refetch();
            refetchProductImage();
            toast.success("Product Image updated successfully!");
            setShowUpdateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to update Product Image");
        }

        setIsSubmitting(false);
    };

    if (productImageLoading) {
        return <Loader height="30dvh" />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <ImageInput
                        fieldId="image"
                        fieldName="image"
                        state={image}
                        setState={setImage}
                        allowUpdateImage
                    >
                        Update Image
                    </ImageInput>
                    <InputField control={form.control} name="serial" label="Serial" placeholder="Enter serial number" />
                    <Button className="mt-2" loading={isSubmitting}>
                        Update Product Image
                    </Button>
                </div>
            </form>
        </Form>
    );
}
