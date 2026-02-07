import { useState } from 'react'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/custom/button'
import { Form } from '@/components/ui/form'
import { forgotPasswordSchema } from '../utils/forgotPasswordSchema'
import InputField from '../../../components/custom/inputField'
import { useForgotPasswordMutation } from '../../../redux/features/auth/authApi'


export function ForgotForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false)
 
  const [forgotPassword] = useForgotPasswordMutation();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

 async function onSubmit(data) {
    setIsLoading(true)
    await forgotPassword(data)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

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
            <Button className='mt-2' loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
