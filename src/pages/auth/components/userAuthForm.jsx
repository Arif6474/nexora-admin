import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/passwordInput'
import { cn } from '@/lib/utils'
import { useLoginMutation } from '../../../redux/features/auth/authApi'
import { useSelector } from 'react-redux'
import { selectEmployee } from '../../../redux/features/auth/authSelectors'
import { loginFormSchema } from '../utils/loginFormSchema'
import InputField from '../../../components/custom/inputField'

export function UserAuthForm({ className, ...props }) {

  const [isLoading, setIsLoading] = useState(false)
  const [login] = useLoginMutation();
  const employee = useSelector(selectEmployee);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)
    await login(data)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    if (employee?.isRegistered) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [navigate, employee]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <InputField
              control={form.control}
              name='email'
              label='Email'
              placeholder='name@example.com'
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
