
import Select from "react-select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export default function SearchSelectField({
  label,
  options,
  value,
  setState,
  placeholder,
  optionLabel = 'label',
  optionValue = 'value',
  search
}) {
  const formattedOptions = options?.map(option => ({
    label: option[optionLabel],
    value: option[optionValue],
  })) || [];

  const selectedOption = formattedOptions.find(option => option.value === value);

  return (
    <div className="text-base text-accent-foreground !bg-transparent ">
      <FormLabel style={{ color: 'hsl(var(--foreground))' }}>{label}</FormLabel>
      <Select
      styles={
        {
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
            boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--ring))' : 'none',
            '&:hover': {
              borderColor: 'hsl(var(--ring))',
            },
            backgroundColor: 'transparent',
            color: 'hsl(var(--foreground))',
            zIndex: 999,
            minWidth: '200px',
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: 'hsl(var(--foreground))',
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--background))',
            color: state.isFocused ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
            '&:active': {
              backgroundColor: 'hsl(var(--ring))',
              color: 'hsl(var(--background))',
            },
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: 'hsl(var(--muted-foreground))',
          }),
        }
      }
       className=""
        // isSearchable={search}
        value={selectedOption}
        options={formattedOptions}
        onChange={(selected) => setState(selected?.value || '')}
        placeholder={placeholder}
      />
    </div>
  );
}