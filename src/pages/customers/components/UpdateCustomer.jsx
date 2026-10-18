import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { useSingleCustomerQuery, useUpdateCustomerMutation } from "../../../redux/features/customers/customerApi";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const customerFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    isActive: z.boolean().default(true),
});

export default function UpdateCustomer({ setShowUpdateForm, refetch, targetID }) {
    const [updateCustomer] = useUpdateCustomerMutation();
    const { data: customer, isLoading: customerLoading, refetch: refetchCustomer } = useSingleCustomerQuery({ id: targetID });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: customer?.name || "",
            phone: customer?.phone || "",
            address: customer?.address || "",
            bio: customer?.bio || "",
            isActive: customer?.isActive ?? true,
        },
    });

    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name || "",
                phone: customer.phone || "",
                address: customer.address || "",
                bio: customer.bio || "",
                isActive: customer.isActive ?? true,
            });
        }
    }, [customer, form]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const result = await updateCustomer({ id: targetID, updatedData: data });

        if (result.data) {
            await refetchCustomer();
            refetch();
            toast.success("Customer updated successfully!");
        } else if (result.error) {
            toast.error(result.error?.data?.message || "Failed to update customer");
        }

        setIsSubmitting(false);
        setShowUpdateForm(false);
    };

    if (customerLoading) {
        return <Loader height="30dvh" />;
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-3 max-h-[75vh] overflow-y-auto px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField
                                control={form.control}
                                name="name"
                                label="Customer Name"
                                placeholder="Full name"
                            />
                            <InputField
                                control={form.control}
                                name="phone"
                                label="Phone Number"
                                placeholder="e.g. 018XXXXXXXX"
                            />
                        </div>

                        <InputField
                            control={form.control}
                            name="address"
                            label="Delivery Address"
                            placeholder="Street, City, Postal Code"
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Bio / Internal Notes</FormLabel>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            rows={3}
                                            placeholder="Notes about preferences, special delivery instructions..."
                                            className="w-full rounded-xl border border-stone-200 dark:border-[#222838] bg-white dark:bg-[#11141b] px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="mt-2" loading={isSubmitting}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
