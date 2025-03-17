import { useNavigate } from 'react-router-dom'
import { MessageSquare, Star, Send, Loader2, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateFeedback, useUserFeedbacks } from '@/hooks/useFeedback'
import { getAccessTokenFromLS } from '@/utils/auth'
import path from '@/constants/path'
import { toast } from 'sonner'
import { format } from 'date-fns'

const feedbackFormSchema = z.object({
  feedback_type: z.enum(['website', 'doctor', 'medicine', 'service'], {
    required_error: 'Please select a feedback type'
  }),
  related_id: z.string().optional(),
  rating: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Please select a rating'
  }),
  content: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters' })
    .max(500, { message: 'Feedback must be less than 500 characters' })
})

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>

const FeedbackPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = Boolean(getAccessTokenFromLS())
  const { data: userFeedbacks, isLoading: isFeedbacksLoading } = useUserFeedbacks()
  const createFeedback = useCreateFeedback()

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback_type: 'website',
      rating: '5',
      content: ''
    }
  })

  const onSubmit = (data: FeedbackFormValues) => {
    if (!isAuthenticated) {
      toast.error('Please log in to submit feedback')
      navigate(path.login)
      return
    }

    const feedbackData = {
      ...data,
      rating: parseInt(data.rating, 10)
    }

    createFeedback.mutate(feedbackData, {
      onSuccess: () => {
        form.reset()
        toast.success('Feedback submitted successfully')
      },
      onError: () => {
        toast.error('Failed to submit feedback')
      }
    })
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <MessageSquare className='h-12 w-12 text-primary' />
          <h1 className='text-3xl font-bold'>Feedback</h1>
          <p className='text-muted-foreground'>
            We value your feedback to help us improve our services. Please share your thoughts with us.
          </p>
        </div>

        <Tabs defaultValue='submit' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='submit'>Submit Feedback</TabsTrigger>
            <TabsTrigger value='history' disabled={!isAuthenticated}>
              My Feedback History
            </TabsTrigger>
          </TabsList>

          <TabsContent value='submit' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Feedback</CardTitle>
                <CardDescription>
                  Tell us about your experience with WebMed. Your feedback is valuable to us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='feedback_type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select a type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='website'>Website</SelectItem>
                              <SelectItem value='doctor'>Doctor Services</SelectItem>
                              <SelectItem value='medicine'>Medicines</SelectItem>
                              <SelectItem value='service'>Customer Service</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select what your feedback is about</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('feedback_type') === 'medicine' && (
                      <FormField
                        control={form.control}
                        name='related_id'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medicine</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a medicine' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='1'>Paracetamol</SelectItem>
                                <SelectItem value='2'>Ibuprofen</SelectItem>
                                <SelectItem value='3'>Amoxicillin</SelectItem>
                                <SelectItem value='4'>Aspirin</SelectItem>
                                <SelectItem value='5'>Vitamin C</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Select the medicine you want to provide feedback about</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch('feedback_type') === 'doctor' && (
                      <FormField
                        control={form.control}
                        name='related_id'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doctor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a doctor' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='101'>Dr. John Smith</SelectItem>
                                <SelectItem value='102'>Dr. Sarah Johnson</SelectItem>
                                <SelectItem value='103'>Dr. Michael Chen</SelectItem>
                                <SelectItem value='104'>Dr. Emily Wilson</SelectItem>
                                <SelectItem value='105'>Dr. David Thompson</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Select the doctor you want to provide feedback about</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name='rating'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className='flex space-x-1'
                            >
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <FormItem key={rating} className='flex items-center space-x-0'>
                                  <FormControl>
                                    <RadioGroupItem
                                      value={rating.toString()}
                                      id={`rating-${rating}`}
                                      className='sr-only'
                                    />
                                  </FormControl>
                                  <FormLabel
                                    htmlFor={`rating-${rating}`}
                                    className={`cursor-pointer rounded-md p-2 ${
                                      parseInt(field.value) >= rating ? 'text-yellow-500' : 'text-muted-foreground'
                                    }`}
                                  >
                                    <Star className='h-6 w-6 fill-current' />
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>Rate your experience from 1 to 5 stars</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='content'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Tell us about your experience...'
                              className='min-h-[120px]'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Your feedback helps us improve our services</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type='submit' className='w-full' disabled={createFeedback.isPending}>
                      {createFeedback.isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className='mr-2 h-4 w-4' />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='history' className='space-y-4'>
            {!isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Login Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>Please log in to view your feedback history.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate(path.login)}>Login</Button>
                </CardFooter>
              </Card>
            ) : isFeedbacksLoading ? (
              <div className='flex h-[300px] items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            ) : !userFeedbacks || userFeedbacks.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Feedback History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>You haven't submitted any feedback yet.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => document.getElementById('submit-tab')?.click()}>
                    Submit Your First Feedback
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className='space-y-4'>
                <h2 className='text-xl font-bold'>Your Previous Feedback</h2>
                {userFeedbacks.map((feedback) => (
                  <Card key={feedback._id}>
                    <CardHeader className='pb-2'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='capitalize'>{feedback.feedback_type} Feedback</CardTitle>
                        <div className='flex items-center'>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-5 w-5 ${
                                index < feedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <CardDescription className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-muted-foreground'>{feedback.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default FeedbackPage
