import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { recoverPasswordSchema } from '../utils/recoverPasswordSchema'
import { useResetPasswordMutation } from '../../../redux/features/auth/authApi'
import { useNavigate, useSearchParams } from 'react-router-dom'


export function RecoverPasswordForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false)
  const [resetPassword] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)
    console.log(data)
    const formData = { newPassword: data.password }
    if (token) {
      formData.token = token
    }
    await resetPassword(formData)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/sign-in')
    }, 2000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel style={{ color: 'hsl(var(--foreground))' }}>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
