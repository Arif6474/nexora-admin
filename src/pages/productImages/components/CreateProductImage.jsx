import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productImageFormSchema } from "../utils/productImageFormSchema";
import { useCreateProductImageMutation } from "../../../redux/features/productImages/productImageApi";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";

export default function CreateProductImage({ setShowCreateForm, refetch, parentID }) {
    const [createProductImage] = useCreateProductImageMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(productImageFormSchema),
        defaultValues: {
            serial: '0',
            image: "",
        },
    });

    const onSubmit = async (data) => {
        if (!image) return toast.error("Please upload an image");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("product", parentID);
        formData.append("image", image);
        formData.append("serial", data.serial);

        const result = await createProductImage(formData);

        if (result.data) {
            refetch();
            toast.success("Product Image created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to create Product Image");
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <ImageInput
                        fieldId="image"
                        fieldName="image"
                        state={image}
                        setState={setImage}
                        allowCreateImage
                    >
                        Upload Image
                    </ImageInput>
                    <InputField control={form.control} name="serial" label="Serial" placeholder="Enter serial number" type="text" />
                    <Button className="mt-2" loading={isLoading}>
                        Create Product Image
                    </Button>
                </div>
            </form>
        </Form>
    );
}
