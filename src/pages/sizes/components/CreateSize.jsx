import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sizeFormSchema } from "../utils/sizeFormSchema";
import { useCreateSizeMutation } from "../../../redux/features/sizes/sizeApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import toast from "react-hot-toast";

export default function CreateSize({ setShowCreateForm, refetch }) {
    const [createSize] = useCreateSizeMutation();
    const [isLoading, setIsLoading] = useState(false);

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

    const onSubmit = async (data) => {
        setIsLoading(true);
        // Ensure required fields are present according to model
        const payload = {
            ...data,
            sizeChart: data.sizeChart || { "Default": "Standard" }, // Basic fallback if empty
        };
        const result = await createSize(payload);

        if (result.data) {
            refetch();
            toast.success("Size created successfully!");
            setShowCreateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to create size");
        }
        setIsLoading(false);
    };

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
                        label="Size (e.g. XL, 42, 32W 30L)"
                        placeholder="Enter size"
                    />
                    <InputField
                        control={form.control}
                        name="serial"
                        label="Serial (for sorting)"
                        placeholder="0"
                    />
                    <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                        <p className="text-xs text-stone-500 font-black uppercase mb-2">Technical Note</p>
                        <p className="text-xs text-stone-400">Detailed size charts and measurements can be updated after creation in the Edit menu.</p>
                    </div>
                    <Button className="mt-2" loading={isLoading}>
                        Create Size
                    </Button>
                </div>
            </form>
        </Form>
    );
}
