/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, MapPin, Phone, Save, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useProfile, useUpdateProfile } from '@/hooks/useAuth'
import path from '@/constants/path'
import { toast } from 'sonner'

const profileFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }).optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(160, { message: 'Bio must be less than 160 characters' }).optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const ProfilePage = () => {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useProfile()
  const updateProfile = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
      location: user?.location || '',
      bio: user?.bio || ''
    }
  })

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
        toast.success('Profile updated successfully')
      },
      onError: () => {
        toast.error('Failed to update profile')
      }
    })
  }

  if (isLoading) {
    return (
      <div className='container flex h-[calc(100vh-200px)] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className='container py-10'>
        <div className='mx-auto max-w-3xl rounded-lg border p-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold'>Error Loading Profile</h2>
          <p className='mb-6 text-muted-foreground'>
            There was a problem loading your profile. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>My Profile</h1>
          <Button variant='outline' onClick={() => navigate(path.changePassword)}>
            Change Password
          </Button>
        </div>

        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='edit'>Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <Card>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-2xl'>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <User className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Username</p>
                        <p>{user.username || 'Not set'}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Mail className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Email</p>
                        <p>{user.email}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Calendar className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Date of Birth</p>
                        <p>{user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Phone</p>
                        <p>{user.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <MapPin className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Location</p>
                        <p>{user.location || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className='mb-2 font-medium'>Bio</h3>
                  <p className='text-muted-foreground'>{user.bio || 'No bio provided'}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/orders')}>View My Orders</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='edit'>
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Make changes to your profile information here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder='Your name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder='Your phone number' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='date_of_birth'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='location'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder='Your location' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='bio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input placeholder='About you' {...field} />
                          </FormControl>
                          <FormDescription>Brief description for your profile. Maximum 160 characters.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='flex justify-end space-x-4'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          form.reset({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || '',
                            date_of_birth: user.date_of_birth
                              ? new Date(user.date_of_birth).toISOString().split('T')[0]
                              : '',
                            location: user.location || '',
                            bio: user.bio || ''
                          })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type='submit' disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className='mr-2 h-4 w-4' />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfilePage
