import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorFormSchema } from "../utils/colorFormSchema";
import { useCreateColorMutation } from "../../../redux/features/colors/colorApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import toast from "react-hot-toast";

export default function CreateColor({ setShowCreateForm, refetch }) {
    const [createColor] = useCreateColorMutation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(colorFormSchema),
        defaultValues: {
            name: '',
            hexCode: '#',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const result = await createColor(data);

        if (result.data) {
            refetch();
            toast.success("Color created successfully!");
            setShowCreateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to create color");
        }
        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <InputField
                        control={form.control}
                        name="name"
                        label="Color Name"
                        placeholder="e.g. Midnight Blue"
                    />
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <InputField
                                control={form.control}
                                name="hexCode"
                                label="Hex Code"
                                placeholder="#000000"
                            />
                        </div>
                        <div
                            className="w-10 h-10 rounded-lg border border-stone-800 mb-0.5"
                            style={{ backgroundColor: form.watch('hexCode') }}
                        />
                    </div>
                    <Button className="mt-2" loading={isLoading}>
                        Create Color
                    </Button>
                </div>
            </form>
        </Form>
    );
}
