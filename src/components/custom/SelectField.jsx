import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SelectField({
  control,
  name,
  label,
  placeholder = 'Select an option',
  options = [],
  readOnly = false,
}) {
  console.log(options);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // ✅ Now you can safely access field.value here
        const selectedOption = options.find((option) => option.value === field.value);
console.log(selectedOption);
        return (
          <FormItem className="space-y-1">
            {label && (
              <FormLabel style={{ color: 'hsl(var(--foreground))' }}>
                {label}
              </FormLabel>
            )}
            <Select
              value={field.value || ''} // ✅ Controlled input
              onValueChange={field.onChange}
              disabled={readOnly}
            >
              <FormControl>
                <SelectTrigger>
                  {/* ✅ show selected label if available */}
                  <SelectValue placeholder={placeholder}>
                    {selectedOption?.label}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default SelectField;
