import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productColorFormSchema } from "../utils/productColorFormSchema";
import { useCreateProductColorMutation } from "../../../redux/features/productColors/productColorApi";
import { useGetColorsQuery } from "../../../redux/features/colors/colorApi";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";

export default function CreateProductColor({ setShowCreateForm, refetch, parentID }) {
    const [createProductColor] = useCreateProductColorMutation();
    const { data: colorsData } = useGetColorsQuery({ filter: 'Active' });
    const colors = colorsData?.documents || [];

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(productColorFormSchema),
        defaultValues: {
            color: "",
            serial: '0',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const payload = {
            ...data,
            product: parentID
        };

        const result = await createProductColor(payload);

        if (result.data) {
            refetch();
            toast.success("Product Color created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        }
        if (result.error) {
            toast.error(result.error.data?.message || "Failed to create Product Color");
            setIsLoading(false);
        }
    };

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

                        <Button className="mt-2" loading={isLoading}>
                            Create Product Color
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
