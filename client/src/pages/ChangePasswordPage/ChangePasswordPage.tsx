import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, ArrowLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useChangePassword } from '@/hooks/useAuth'
import path from '@/constants/path'
import { toast } from 'sonner'

const passwordFormSchema = z
  .object({
    old_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    new_password: z
      .string()
      .min(6, { message: 'New password must be at least 6 characters' })
      .max(50, { message: 'New password must be less than 50 characters' }),
    confirm_new_password: z.string().min(6, { message: 'Confirm password must be at least 6 characters' })
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ['confirm_new_password']
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const changePassword = useChangePassword()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    }
  })

  const onSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        form.reset()
        toast.success('Password changed successfully')
        navigate(path.profile)
      },
      onError: (error) => {
        console.error('Change password error:', error)
      }
    })
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-md space-y-8'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate(path.profile)}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-2xl font-bold'>Change Password</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Your Password</CardTitle>
            <CardDescription>
              For security, please enter your current password followed by your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='old_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder='Enter your current password'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3'
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className='h-4 w-4 text-muted-foreground' />
                            ) : (
                              <Eye className='h-4 w-4 text-muted-foreground' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder='Enter your new password'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3'
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className='h-4 w-4 text-muted-foreground' />
                            ) : (
                              <Eye className='h-4 w-4 text-muted-foreground' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>Password must be at least 6 characters long.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirm_new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm your new password'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-4 w-4 text-muted-foreground' />
                            ) : (
                              <Eye className='h-4 w-4 text-muted-foreground' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end space-x-4'>
                  <Button type='button' variant='outline' onClick={() => navigate(path.profile)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={changePassword.isPending}>
                    {changePassword.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className='mr-2 h-4 w-4' />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex justify-between border-t px-6 py-4'>
            <div className='text-sm text-muted-foreground'>
              <Lock className='mr-1 inline-block h-4 w-4' />
              Your password is securely encrypted
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ChangePasswordPage
