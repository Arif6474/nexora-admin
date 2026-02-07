import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/passwordInput';
import { cn } from '@/lib/utils';
import { useGetEmailFromTokenQuery, useRegisterMutation } from '../../../redux/features/auth/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signUpFormSchema } from '../utils/signUpFormSchema';
import InputField from '../../../components/custom/inputField';
import { useSelector } from 'react-redux';
import { selectEmployee } from '../../../redux/features/auth/authSelectors';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageInput } from "@/components/custom/ImageInput/ImageInput";

export function SignUpForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const employee = useSelector(selectEmployee);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { data: getEmailFromToken } = useGetEmailFromTokenQuery({ token });
  const [register] = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (getEmailFromToken) {
      form.setValue('name', getEmailFromToken?.name);
      form.setValue('email', getEmailFromToken?.email);
      form.setValue('phone', getEmailFromToken?.phone);
    }
  }, [getEmailFromToken]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phone', data.phone);

      if (image) {
        formData.append('image', image);
      }

      await register(formData);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 2000);

    } catch (error) {
      setIsLoading(false);
      console.error("Form submission error: ", error);
    }
  };

  useEffect(() => {
    if (employee?.isRegistered) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navigate, employee]);

  return (
    <div className={cn('grid gap-6 ')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <InputField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Name"
            />
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="name@example.com"
              readOnly
            />
            <InputField
              control={form.control}
              name="phone"
              label="Phone"
              placeholder="Phone Number"
            />
            <ImageInput
              fieldId="image"
              state={image}
              setState={setImage}
              allowCreateImage
            >
              Upload Profile Image
            </ImageInput>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-2"
              loading={isLoading}
              type="submit"
              disabled={!form.formState.isValid || isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
