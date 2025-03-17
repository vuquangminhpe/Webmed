/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Award,
  Briefcase,
  Star,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useDoctor, useBookAppointment } from '@/hooks/useDoctor'
import { getAccessTokenFromLS } from '@/utils/auth'
import path from '@/constants/path'
import { toast } from 'sonner'

const appointmentFormSchema = z.object({
  date: z.date({
    required_error: 'Please select a date'
  }),
  time: z.string({
    required_error: 'Please select a time'
  }),
  reason: z
    .string()
    .min(5, { message: 'Reason must be at least 5 characters' })
    .max(500, { message: 'Reason must be less than 500 characters' })
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isAuthenticated = Boolean(getAccessTokenFromLS())
  const { data: doctor, isLoading, error } = useDoctor(id || '')
  const bookAppointment = useBookAppointment()

  const [availableTimes] = useState<string[]>([
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM'
  ])

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      reason: ''
    }
  })

  const selectedDate = form.watch('date')

  const onSubmit = (data: AppointmentFormValues) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment')
      navigate(path.login)
      return
    }

    if (!id) {
      toast.error('Doctor information is missing')
      return
    }

    const appointmentData = {
      doctor_id: id,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      reason: data.reason
    }

    bookAppointment.mutate(appointmentData)
  }

  if (isLoading) {
    return (
      <div className='container flex h-[calc(100vh-200px)] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p>Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className='container py-10'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate(path.doctors)}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-2xl font-bold'>Error Loading Doctor Profile</h1>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center rounded-lg border border-destructive p-8 text-center text-destructive'>
          <AlertCircle className='mb-2 h-10 w-10' />
          <h3 className='mb-2 text-lg font-semibold'>Doctor Not Found</h3>
          <p>
            The doctor you're looking for couldn't be found. Please return to the{' '}
            <Link to={path.doctors} className='font-medium underline'>
              Doctors Page
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => navigate(path.doctors)}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-2xl font-bold'>Doctor Profile</h1>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader className='flex flex-row items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-2xl'>{doctor.name}</CardTitle>
                <CardDescription className='flex flex-wrap items-center gap-2 pt-1'>
                  <Badge variant='outline' className='text-sm'>
                    {doctor.specialization}
                  </Badge>
                  <div className='flex items-center'>
                    <Star className='mr-1 h-4 w-4 fill-yellow-500 text-yellow-500' />
                    <span>{doctor.rating} Rating</span>
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Tabs defaultValue='about'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='about'>About</TabsTrigger>
                  <TabsTrigger value='experience'>Experience</TabsTrigger>
                  <TabsTrigger value='reviews'>Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value='about' className='space-y-6 pt-4'>
                  <div className='rounded-lg bg-muted p-6'>
                    <h3 className='mb-3 font-semibold'>Professional Statement</h3>
                    <p className='text-muted-foreground'>
                      {doctor.bio ||
                        `Dr. ${doctor.name.split(' ')[1]} is an experienced ${doctor.specialization} specialist with over ${doctor.experience} years of clinical experience. Committed to providing high-quality, patient-centered care.`}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='flex items-start gap-2'>
                      <Briefcase className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Experience</p>
                        <p className='text-muted-foreground'>{doctor.experience} years</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <Award className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Qualification</p>
                        <p className='text-muted-foreground'>{doctor.qualification}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <MapPin className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Location</p>
                        <p className='text-muted-foreground'>{doctor.location}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <Phone className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Contact</p>
                        <p className='text-muted-foreground'>{doctor.contact}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <Calendar className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Availability</p>
                        <p className='text-muted-foreground'>{doctor.availability.join(', ')}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <Clock className='mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>Working Hours</p>
                        <p className='text-muted-foreground'>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='experience' className='space-y-6 pt-4'>
                  <div className='space-y-4'>
                    <div className='rounded-lg border p-4'>
                      <h3 className='mb-2 text-lg font-medium'>Professional Experience</h3>
                      <div className='space-y-4'>
                        <div>
                          <p className='font-medium'>Senior Consultant, General Hospital</p>
                          <p className='text-sm text-muted-foreground'>2018 - Present</p>
                          <p className='mt-1 text-sm text-muted-foreground'>
                            Leading the {doctor.specialization} department and providing specialized care to patients.
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className='font-medium'>Specialist, Medical Center</p>
                          <p className='text-sm text-muted-foreground'>2012 - 2018</p>
                          <p className='mt-1 text-sm text-muted-foreground'>
                            Worked as a specialist providing diagnosis and treatment in {doctor.specialization}.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border p-4'>
                      <h3 className='mb-2 text-lg font-medium'>Education & Training</h3>
                      <div className='space-y-4'>
                        <div>
                          <p className='font-medium'>Fellowship in {doctor.specialization}</p>
                          <p className='text-sm text-muted-foreground'>University Medical School, 2010 - 2012</p>
                        </div>
                        <Separator />
                        <div>
                          <p className='font-medium'>MD, Medical Sciences</p>
                          <p className='text-sm text-muted-foreground'>
                            State University School of Medicine, 2006 - 2010
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className='font-medium'>Bachelor of Science, Biology</p>
                          <p className='text-sm text-muted-foreground'>University College, 2002 - 2006</p>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border p-4'>
                      <h3 className='mb-2 text-lg font-medium'>Certifications</h3>
                      <div className='space-y-4'>
                        <div>
                          <p className='font-medium'>Board Certified in {doctor.specialization}</p>
                          <p className='text-sm text-muted-foreground'>American Board of Medical Specialties, 2012</p>
                        </div>
                        <Separator />
                        <div>
                          <p className='font-medium'>Advanced Life Support</p>
                          <p className='text-sm text-muted-foreground'>Renewed 2022</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='reviews' className='pt-4'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-medium'>Patient Reviews</h3>
                      <Button variant='outline' size='sm'>
                        <MessageSquare className='mr-2 h-4 w-4' />
                        Write a Review
                      </Button>
                    </div>

                    <div className='rounded-lg bg-muted p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-baseline gap-2'>
                          <span className='text-3xl font-bold'>{doctor.rating}</span>
                          <span className='text-muted-foreground'>out of 5</span>
                        </div>
                        <div className='flex items-center'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(doctor.rating)
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className='mt-2 text-sm text-muted-foreground'>Based on 48 patient reviews</p>
                    </div>

                    <div className='space-y-4'>
                      {[
                        {
                          name: 'John D.',
                          rating: 5,
                          date: '2023-06-15',
                          comment:
                            'Excellent doctor! Very knowledgeable and took time to explain everything thoroughly. Would highly recommend.'
                        },

                        {
                          name: 'Robert H.',
                          rating: 5,
                          date: '2023-04-10',
                          comment:
                            'Great experience overall. Very thorough examination and clear explanation of treatment options.'
                        }
                      ].map((review, index) => (
                        <Card key={index}>
                          <CardHeader className='pb-2'>
                            <div className='flex justify-between'>
                              <div>
                                <CardTitle className='text-base'>{review.name}</CardTitle>
                                <CardDescription>{format(new Date(review.date), 'MMMM dd, yyyy')}</CardDescription>
                              </div>
                              <div className='flex items-center'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className='text-sm text-muted-foreground'>{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className='flex justify-center'>
                      <Button variant='outline'>Load More Reviews</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Select a date and time to book your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <Calendar className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <CalendarComponent
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: any) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)

                                const dayOfWeek = format(date, 'EEEE')
                                return date < today || !doctor.availability.includes(dayOfWeek)
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The doctor is available on {doctor.availability.join(', ')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='time'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='grid grid-cols-3 gap-2'
                          >
                            {availableTimes.map((time) => (
                              <FormItem key={time} className='flex items-center space-x-0'>
                                <FormControl>
                                  <RadioGroupItem
                                    value={time}
                                    id={`time-${time}`}
                                    className='sr-only'
                                    disabled={!selectedDate}
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={`time-${time}`}
                                  className={`w-full cursor-pointer rounded-md border p-2 text-center text-sm ${
                                    field.value === time
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-input hover:bg-accent hover:text-accent-foreground'
                                  } ${!selectedDate ? 'opacity-50' : ''}`}
                                >
                                  {time}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>Select an available time slot</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Briefly describe your symptoms or reason for consultation'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full' disabled={bookAppointment.isPending}>
                    {bookAppointment.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Booking...
                      </>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className='flex justify-center border-t px-6 py-4'>
              <div className='text-center text-sm text-muted-foreground'>
                <p>Need urgent care?</p>
                <p>
                  Call <span className='font-medium'>{doctor.contact}</span>
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Insurance Information */}
          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-4'>
                Dr. {doctor.name.split(' ')[1]} accepts the following insurance plans:
              </p>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckIcon className='h-4 w-4 mr-2 text-green-500' />
                  Medicare
                </li>
                <li className='flex items-center'>
                  <CheckIcon className='h-4 w-4 mr-2 text-green-500' />
                  Blue Cross Blue Shield
                </li>
                <li className='flex items-center'>
                  <CheckIcon className='h-4 w-4 mr-2 text-green-500' />
                  Aetna
                </li>
                <li className='flex items-center'>
                  <CheckIcon className='h-4 w-4 mr-2 text-green-500' />
                  UnitedHealthcare
                </li>
                <li className='flex items-center'>
                  <CheckIcon className='h-4 w-4 mr-2 text-green-500' />
                  Cigna
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full' onClick={() => navigate('/resources/insurance-guide')}>
                Insurance Guide
              </Button>
            </CardFooter>
          </Card>

          {/* Office Location */}
          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Office Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='rounded-lg bg-muted aspect-video w-full flex items-center justify-center'>
                <MapPin className='h-8 w-8 text-muted-foreground' />
              </div>
              <div className='mt-4'>
                <p className='font-medium'>Medical Center</p>
                <p className='text-sm text-muted-foreground'>
                  123 Healthcare Ave, {doctor.location}
                  <br />
                  Suite 101
                  <br />
                  Phone: {doctor.contact}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full'>
                Get Directions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M20 6L9 17l-5-5' />
  </svg>
)

export default DoctorDetailPage
