import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sizeFormSchema } from "../utils/sizeFormSchema";
import { useSingleSizeQuery, useUpdateSizeMutation } from "../../../redux/features/sizes/sizeApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import Loader from "@/components/Shared/loader/loader";
import toast from "react-hot-toast";

export default function UpdateSize({ setShowUpdateForm, refetch, targetID }) {
    const [updateSize] = useUpdateSizeMutation();
    const { data: size, isLoading: sizeLoading } = useSingleSizeQuery({ id: targetID });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(sizeFormSchema),
        defaultValues: {
            itemType: 'Clothing',
            gender: 'Male',
            size: '',
            serial: '0',
            sizeChart: {},
            measurements: {},
        },
    });

    useEffect(() => {
        if (size) {
            form.reset({
                itemType: size.itemType,
                gender: size.gender,
                size: size.size,
                serial: size.serial?.toString() || '0',
                sizeChart: size.sizeChart || {},
                measurements: size.measurements || {},
            });
        }
    }, [size, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const result = await updateSize({ id: targetID, updatedData: data });

        if (result.data) {
            refetch();
            toast.success("Size updated successfully!");
            setShowUpdateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to update size");
        }
        setIsSubmitting(false);
    };

    if (sizeLoading) return <Loader height="30dvh" />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            control={form.control}
                            name="itemType"
                            label="Item Type"
                            options={[
                                { label: 'Clothing', value: 'Clothing' },
                                { label: 'Shoes', value: 'Shoes' },
                            ]}
                        />
                        <SelectField
                            control={form.control}
                            name="gender"
                            label="Gender"
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                            ]}
                        />
                    </div>
                    <InputField
                        control={form.control}
                        name="size"
                        label="Size"
                        placeholder="Enter size"
                    />
                    <InputField
                        control={form.control}
                        name="serial"
                        label="Serial"
                        placeholder="Enter serial"
                    />
                    <Button className="mt-2" loading={isSubmitting}>
                        Update Size
                    </Button>
                </div>
            </form>
        </Form>
    );
}
