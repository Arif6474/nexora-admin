import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSizeFormSchema } from "../utils/productSizeFormSchema";
import { useGetSingleProductSizeQuery, useUpdateProductSizeMutation } from "../../../redux/features/productSizes/productSizeApi";
import { useGetSizesQuery } from "../../../redux/features/sizes/sizeApi";
import { Button } from "@/components/custom/button";
import InputField from "@/components/custom/inputField";
import SelectField from "@/components/custom/SelectField";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/loader/loader";
import { Form } from "@/components/ui/form";

export default function UpdateProductSize({ setShowUpdateForm, refetch, targetID, parentID }) {
  const [updateProductSize] = useUpdateProductSizeMutation();
  const { data: productSize, isLoading: productSizeLoading, refetch: refetchProductSize } = useGetSingleProductSizeQuery({ id: targetID });
  const { data: sizesData } = useGetSizesQuery({ filter: 'Active' });
  const sizes = sizesData?.documents || [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSizeFormSchema),
    defaultValues: {
      size: "",
      serial: '0',
    },
  });

  useEffect(() => {
    if (productSize) {
      form.reset({
        size: productSize?.size?._id || productSize?.size || "",
        serial: productSize?.serial?.toString() || "0",
      });
    }
  }, [productSize, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    data.product = parentID || productSize?.product;
    const result = await updateProductSize({ id: targetID, updatedData: data });

    if (result.data) {
      refetch();
      refetchProductSize();
      toast.success("Product Size updated successfully!");
      setShowUpdateForm(false);
    } else if (result.error) {
      toast.error(result.error.data?.message || "Failed to update Product Size");
    }

    setIsSubmitting(false);
  };

  if (productSizeLoading) {
    return <Loader height="30dvh" />;
  }

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
          <InputField control={form.control} name="serial" label="Serial" placeholder="Enter serial number" />
          <Button className="mt-2" loading={isSubmitting}>
            Update Product Size
          </Button>
        </div>
      </form>
    </Form>
  );
}
