import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorFormSchema } from "../utils/colorFormSchema";
import { useSingleColorQuery, useUpdateColorMutation } from "../../../redux/features/colors/colorApi";
import { Form } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import Loader from "@/components/Shared/loader/loader";
import toast from "react-hot-toast";

export default function UpdateColor({ setShowUpdateForm, refetch, targetID }) {
    const [updateColor] = useUpdateColorMutation();
    const { data: color, isLoading: colorLoading } = useSingleColorQuery({ id: targetID });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(colorFormSchema),
        defaultValues: {
            name: "",
            hexCode: "",
        },
    });

    useEffect(() => {
        if (color) {
            form.reset({
                name: color.name,
                hexCode: color.hexCode,
            });
        }
    }, [color, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const result = await updateColor({ id: targetID, updatedData: data });

        if (result.data) {
            refetch();
            toast.success("Color updated successfully!");
            setShowUpdateForm(false);
        } else if (result.error) {
            toast.error(result.error.data?.message || "Failed to update color");
        }
        setIsSubmitting(false);
    };

    if (colorLoading) return <Loader height="30dvh" />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <InputField
                        control={form.control}
                        name="name"
                        label="Color Name"
                        placeholder="Enter color name"
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
                    <Button className="mt-2" loading={isSubmitting}>
                        Update Color
                    </Button>
                </div>
            </form>
        </Form>
    );
}
