import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

function InputField({ control, name, label, placeholder, readOnly, type = 'text' }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1">
                    <FormLabel style={{ color: 'hsl(var(--foreground))' }}>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} readOnly={readOnly} type={type}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default InputField;
