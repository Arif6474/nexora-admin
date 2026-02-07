import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSizeFormSchema } from "../utils/productSizeFormSchema";
import { useCreateProductSizeMutation } from "../../../redux/features/productSizes/productSizeApi";
import { useGetSizesQuery } from "../../../redux/features/sizes/sizeApi";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import toast from "react-hot-toast";

export default function CreateProductSize({ setShowCreateForm, refetch, parentID }) {
    const [createProductSize] = useCreateProductSizeMutation();
    const { data: sizesData } = useGetSizesQuery({ filter: 'Active' });
    const sizes = sizesData?.documents || [];

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(productSizeFormSchema),
        defaultValues: {
            size: "",
            serial: '0',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        data.product = parentID;
        const result = await createProductSize(data);

        if (result.data) {
            refetch();
            toast.success("Product Size created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to create Product Size");
            setIsLoading(false);
        }
    };

    const sizeOptions = sizes.map(s => ({
        label: `${s.size} (${s.gender} - ${s.itemType})`,
        value: s._id
    }));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <SelectField
                        control={form.control}
                        name="size"
                        label="Select Size"
                        options={sizeOptions}
                        placeholder="Choose a master size"
                    />
                    <InputField control={form.control} name="serial" label="Serial" placeholder="Enter serial number" type="text" />
                    <Button className="mt-2" loading={isLoading}>
                        Create Product Size
                    </Button>
                </div>
            </form>
        </Form>
    );
}
