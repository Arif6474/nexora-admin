import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialFormSchema } from "../utils/testimonialFormSchema";
import { useCreateTestimonialMutation } from "../../../redux/features/testimonials/testimonialApi";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";
import toast from "react-hot-toast";

const RATING_OPTIONS = [
    { label: "5 Stars (★★★★★)", value: "5" },
    { label: "4 Stars (★★★★☆)", value: "4" },
    { label: "3 Stars (★★★☆☆)", value: "3" },
    { label: "2 Stars (★★☆☆☆)", value: "2" },
    { label: "1 Star (★☆☆☆☆)", value: "1" },
];

const SIZE_OPTIONS = [
    { label: "Small Card", value: "small" },
    { label: "Medium Card", value: "medium" },
    { label: "Large Card", value: "large" },
];

export default function CreateTestimonial({ setShowCreateForm, refetch }) {
    const [createTestimonial] = useCreateTestimonialMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues: {
            author: '',
            role: 'Verified Buyer',
            content: '',
            rating: 5,
            size: 'medium',
            serial: 1,
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();

        formData.append("author", data.author);
        formData.append("role", data.role || 'Verified Buyer');
        formData.append("content", data.content);
        formData.append("rating", Number(data.rating) || 5);
        formData.append("size", data.size || 'medium');
        formData.append("serial", Number(data.serial) || 1);
        if (image) formData.append("image", image);

        const result = await createTestimonial(formData);

        if (result.data) {
            refetch();
            toast.success("Testimonial created successfully!");
            setIsLoading(false);
            setShowCreateForm(false);
        }
        if (result.error) {
            toast.error(result.error?.data?.message || result.error?.data?.error || "Failed to create testimonial");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-3 max-h-[75vh] overflow-y-auto px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField
                                control={form.control}
                                name="author"
                                label="Author / Customer Name"
                                placeholder="e.g. Sarah Jenkins"
                            />
                            <InputField
                                control={form.control}
                                name="role"
                                label="Role / Location"
                                placeholder="e.g. Creative Director, Paris"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <SelectField
                                control={form.control}
                                name="rating"
                                label="Rating"
                                options={RATING_OPTIONS}
                                placeholder="Select rating"
                            />
                            <SelectField
                                control={form.control}
                                name="size"
                                label="Card Display Size"
                                options={SIZE_OPTIONS}
                                placeholder="Select card size"
                            />
                            <InputField
                                control={form.control}
                                name="serial"
                                label="Display Serial"
                                placeholder="1"
                                type="number"
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Testimonial Quote / Review</FormLabel>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            rows={4}
                                            placeholder="Write customer review or quote here..."
                                            className="w-full rounded-xl border border-stone-200 dark:border-[#222838] bg-white dark:bg-[#11141b] px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ImageInput
                            fieldId="image"
                            fieldName="image"
                            state={image}
                            setState={setImage}
                            allowCreateImage
                        >
                            Upload Customer Avatar
                        </ImageInput>

                        <Button className="mt-2" loading={isLoading}>
                            Create Testimonial
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
