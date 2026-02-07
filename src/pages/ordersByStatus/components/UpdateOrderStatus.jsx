import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom/button";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { Form } from "@/components/ui/form";
import SelectField from "@/components/custom/SelectField";
import {
  useGetSingleOrderQuery,
  useUpdateOrderStatusByIdMutation,
} from "../../../redux/features/orders/orderApi";

export default function UpdateOrderStatus({ setShowUpdateForm, refetch, targetID }) {
  const { data: order, isLoading } = useGetSingleOrderQuery({ id: targetID });
  const [updateOrderStatus] = useUpdateOrderStatusByIdMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      orderStatus: order?.order.orderStatus || "",
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        orderStatus: order?.order.orderStatus || "",
      });
    }
  }, [order, form]);

  const allOptions =  [
      { value: "Pending", label: "Pending" },
      { value: "Processing", label: "Processing" },
      { value: "Shipped", label: "Shipped" },
      { value: "Delivered", label: "Delivered" },
      { value: "Cancelled", label: "Cancelled" },
      { value: "Returned", label: "Returned" },
    ]

  const filteredOptions = useMemo(() => {
    const status = order?.order.orderStatus;

    switch (status) {
      case "Pending":
        return allOptions;
      case "Processing":
        return allOptions.filter((opt) =>
          ["Processing","Shipped", "Delivered", "Cancelled", "Returned"].includes(opt.value)
        );
      case "Shipped":
        return allOptions.filter((opt) =>
          ["Shipped", "Delivered", "Cancelled", "Returned"].includes(opt.value)
        );
      case "Delivered":
        return allOptions.filter((opt) => opt.value === "Completed");
      default:
        return allOptions;
    }
  }, [order?.orderStatus, allOptions]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await updateOrderStatus({
        id: targetID,
        updatedData: { orderStatus: data.orderStatus },
      });

      if (result.data) {
        refetch();
        toast.success("Order status updated successfully!");
        setShowUpdateForm(false);
      } else {
        toast.error(result.error?.data?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Conditional rendering happens after all hooks
  if (isLoading) {
    return <Loader height="30dvh" />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <SelectField
              control={form.control}
              name="orderStatus"
              label="Order Status"
              placeholder="Select Order Status"
              options={filteredOptions}
            />
            <Button className="mt-2" loading={isSubmitting}>
              Update Order Status
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
