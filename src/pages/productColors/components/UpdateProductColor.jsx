import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productColorFormSchema } from "../utils/productColorFormSchema";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { useSingleProductColorQuery, useUpdateProductColorMutation } from "../../../redux/features/productColors/productColorApi";
import { useGetColorsQuery } from "../../../redux/features/colors/colorApi";
import { Form } from "@/components/ui/form";

export default function UpdateProductColor({ setShowUpdateForm, refetch, targetID, parentID }) {
    const [updateProductColor] = useUpdateProductColorMutation();
    const { data: productColor, isLoading: productColorLoading, refetch: refetchProductColor } = useSingleProductColorQuery({ id: targetID });
    const { data: colorsData } = useGetColorsQuery({ filter: 'Active' });
    const colors = colorsData?.documents || [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(productColorFormSchema),
        defaultValues: {
            color: "",
            serial: '0',
        },
    });

    useEffect(() => {
        if (productColor) {
            form.reset({
                color: productColor?.color?._id || productColor?.color || "",
                serial: productColor?.serial?.toString() || "0",
            });
        }
    }, [productColor, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const payload = {
            ...data,
            product: parentID || productColor?.product || ""
        };

        const result = await updateProductColor({ id: targetID, updatedData: payload });

        if (result.data) {
            await refetchProductColor();
            refetch();
            toast.success("Product Color updated successfully!");
            setShowUpdateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to update Product Color");
        }

        setIsSubmitting(false);
    };

    if (productColorLoading) {
        return <Loader height="30dvh" />;
    }

    const colorOptions = colors.map(c => ({
        label: `${c.name} (${c.hexCode})`,
        value: c._id
    }));

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <SelectField
                            control={form.control}
                            name="color"
                            label="Select Color"
                            options={colorOptions}
                            placeholder="Choose a master color"
                        />
                        <InputField
                            control={form.control}
                            name="serial"
                            label="Serial"
                            type="text"
                            placeholder="Enter serial"
                        />
                        <Button className="mt-2" loading={isSubmitting}>
                            Update Product Color
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
