/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Star, MapPin, Calendar, Phone, Clock, Award, FileText, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Textarea } from '@/components/ui/textarea'
import doctorApi from '@/apis/doctors.api'
import path from '@/constants/path'
import { useDoctor } from '@/hooks/useDoctor'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Label } from '@/Components/ui/label'
import { toast } from 'sonner'
import { DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog'

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('about')
  const [reviewContent, setReviewContent] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

  // Get doctor details
  const { data: doctorData, isLoading: isLoadingDoctor, error: doctorError } = useDoctor(id || '')

  // Get doctor reviews
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    refetch: refetchReviews
  } = useQuery({
    queryKey: ['doctor-reviews', id],
    queryFn: () => doctorApi.getDoctorReviews(id || '', 1, 10).then((res) => res.data.result),
    enabled: !!id
  })

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: ({ doctorId, rating, comment }: { doctorId: string; rating: number; comment: string }) =>
      doctorApi.submitDoctorReview(doctorId, { rating, comment }),
    onSuccess: () => {
      toast('Review Submitted')
      setReviewContent('')
      setReviewRating(5)
      setReviewDialogOpen(false)
      refetchReviews()
    },
    onError: () => {
      toast('Failed to submit review. Please try again.')
    }
  })

  const handleSubmitReview = () => {
    if (!id) return

    submitReviewMutation.mutate({
      doctorId: id,
      rating: reviewRating,
      comment: reviewContent
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className='flex'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    )
  }

  if (isLoadingDoctor) {
    return (
      <div className='container py-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
      </div>
    )
  }

  if (doctorError || !doctorData) {
    return (
      <div className='container py-10'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <FileText className='h-12 w-12 text-destructive mb-4' />
            <h2 className='text-xl font-semibold mb-2'>Doctor Not Found</h2>
            <p className='text-muted-foreground mb-4'>The doctor you're looking for doesn't exist or was removed.</p>
            <Button onClick={() => navigate(path.doctors)}>Back to Doctors</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const doctor = doctorData
  console.log(doctorData)

  if (!doctor) {
    return
  }
  return (
    <div className='container py-10'>
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row'>
            <div className='flex flex-col items-center md:items-start mb-6 md:mb-0 md:mr-8'>
              <Avatar className='h-32 w-32 mb-4'>
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback className='text-2xl'>{doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-center md:items-start space-y-2'>
                <Button className='w-full' onClick={() => navigate(`/appointments/book/${doctor._id}`)}>
                  Book Appointment
                </Button>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant='outline' className='w-full'>
                      Write a Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Review Dr. {doctor.name}</DialogTitle>
                      <DialogDescription>
                        Share your experience with this doctor to help others make informed decisions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='rating'>Rating</Label>
                        <RadioGroup
                          defaultValue='5'
                          value={reviewRating.toString()}
                          onValueChange={(value) => setReviewRating(parseInt(value))}
                          className='flex space-x-2'
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className='flex items-center space-x-1'>
                              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                              <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='review'>Your Review</Label>
                        <Textarea
                          id='review'
                          placeholder='Tell us about your experience...'
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          rows={5}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!reviewContent.trim() || submitReviewMutation.isPending}
                      >
                        {submitReviewMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Submit Review
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className='flex-1'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
                <div>
                  <h1 className='text-2xl font-bold'>{doctor.name}</h1>
                  <div className='flex items-center mt-1'>
                    <Badge className='mr-2'>{doctor.specialization}</Badge>
                    <div className='flex items-center'>
                      {renderStars(doctor.rating)}
                      <span className='ml-1 text-sm text-muted-foreground'>({doctor.rating})</span>
                    </div>
                  </div>
                </div>
                <div className='mt-4 md:mt-0'>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Award className='mr-2 h-4 w-4' />
                    <span>{doctor.experience} years experience</span>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='flex items-center text-sm'>
                  <MapPin className='mr-2 h-4 w-4 text-muted-foreground' />
                  <span>{doctor.location}</span>
                </div>
                <div className='flex items-center text-sm'>
                  <Phone className='mr-2 h-4 w-4 text-muted-foreground' />
                  <span>{doctor.contact}</span>
                </div>
                <div className='flex items-center text-sm'>
                  <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                  <span>Available on {doctor.availability.join(', ')}</span>
                </div>
                <div className='flex items-center text-sm'>
                  <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
                  <span>Check availability for appointment times</span>
                </div>
              </div>

              {doctor.bio && (
                <div className='mb-4'>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>About</h3>
                  <p>{doctor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='about' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='about'>About</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          <TabsTrigger value='availability'>Availability</TabsTrigger>
        </TabsList>

        <TabsContent value='about' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-medium'>Qualification</h3>
                <p className='text-muted-foreground'>{doctor.qualification}</p>
              </div>
              <Separator />
              <div>
                <h3 className='font-medium'>Specialization</h3>
                <p className='text-muted-foreground'>{doctor.specialization}</p>
              </div>
              <Separator />
              <div>
                <h3 className='font-medium'>Experience</h3>
                <p className='text-muted-foreground'>{doctor.experience} years</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-medium'>Location</h3>
                <p className='text-muted-foreground'>{doctor.location}</p>
              </div>
              <Separator />
              <div>
                <h3 className='font-medium'>Contact</h3>
                <p className='text-muted-foreground'>{doctor.contact}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reviews' className='mt-6'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>Patient Reviews</CardTitle>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size='sm'>
                      <MessageSquare className='mr-2 h-4 w-4' />
                      Write a Review
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className='flex justify-center py-8'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
              ) : reviewsData?.reviews?.length === 0 ? (
                <div className='text-center py-8'>
                  <MessageSquare className='mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4' />
                  <h3 className='text-lg font-medium mb-2'>No Reviews Yet</h3>
                  <p className='text-muted-foreground mb-4'>Be the first to review Dr. {doctor.name}</p>
                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Write a Review</Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ) : (
                <div className='space-y-6'>
                  {reviewsData?.reviews?.map((review: any) => (
                    <div key={review._id} className='pb-6 border-b last:border-0'>
                      <div className='flex justify-between mb-2'>
                        <div className='flex items-center'>
                          <Avatar className='h-8 w-8 mr-2'>
                            <AvatarFallback>{review.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className='font-medium'>{review.user_name}</span>
                        </div>
                        <div className='flex items-center'>{renderStars(review.rating)}</div>
                      </div>
                      <p className='text-muted-foreground mt-2'>{review.comment}</p>
                      <div className='flex items-center mt-3 text-xs text-muted-foreground'>
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {reviewsData?.pagination && reviewsData.pagination.totalPages > 1 && (
              <CardFooter>
                <div className='flex justify-center w-full'>
                  <Button variant='outline' size='sm'>
                    Load More Reviews
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='availability' className='mt-6'>
          <AvailabilityTab doctorId={doctor._id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Separate component for availability tab to handle its own state
const AvailabilityTab = ({ doctorId }: { doctorId: string }) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  )

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-availability', doctorId, selectedDate],
    queryFn: () => doctorApi.getDoctorAvailability(doctorId, selectedDate).then((res) => res.data.result),
    enabled: !!doctorId && !!selectedDate
  })

  // Generate dates for the next 14 days
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Select a date to see available appointment slots</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-2 md:grid-cols-7 gap-2'>
          {next14Days.slice(0, 7).map((date) => (
            <Button
              key={date.value}
              variant={selectedDate === date.value ? 'default' : 'outline'}
              className='text-xs flex flex-col h-auto py-2'
              onClick={() => setSelectedDate(date.value)}
            >
              <span>{date.label.split(',')[0]}</span>
              <span>{date.label.split(',')[1]}</span>
            </Button>
          ))}
        </div>

        <div className='mt-6'>
          <h3 className='text-sm font-medium mb-4'>
            Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
          </h3>

          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          ) : !data?.available_times || data.available_times.length === 0 ? (
            <div className='text-center py-8 border rounded-md'>
              <Calendar className='mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4' />
              <h3 className='text-lg font-medium mb-2'>No Available Slots</h3>
              <p className='text-muted-foreground mb-4'>Try another date or contact the doctor directly</p>
            </div>
          ) : (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
              {data.available_times.map((time: string) => (
                <Button
                  key={time}
                  variant='outline'
                  className='text-sm'
                  onClick={() => navigate(`/appointments/book/${doctorId}?date=${selectedDate}&time=${time}`)}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button onClick={() => navigate(`/appointments/book/${doctorId}`)}>Book Appointment</Button>
      </CardFooter>
    </Card>
  )
}

export default DoctorDetailPage
