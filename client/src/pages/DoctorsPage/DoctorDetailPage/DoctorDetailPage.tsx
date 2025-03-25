/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Star,
  MapPin,
  Calendar,
  Phone,
  Clock,
  Award,
  FileText,
  MessageSquare,
  Loader2,
  User,
  ArrowLeft,
  Heart,
  Stethoscope,
  GraduationCap,
  Building,
  Share2,
  Mail,
  MessageCircle,
  BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import doctorApi from '@/apis/doctors.api'
import path from '@/constants/path'
import { useDoctor } from '@/hooks/useDoctor'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Label } from '@/Components/ui/label'
import { toast } from 'sonner'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'

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
            className={`h-5 w-5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  // Function to render rating selection stars
  const renderRatingSelector = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className='flex space-x-2'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type='button' onClick={() => onChange(star)} className='focus:outline-none'>
            <Star
              className={`h-8 w-8 ${
                star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (isLoadingDoctor) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex justify-center items-center'>
        <div className='relative'>
          <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
          <Loader2 className='relative h-16 w-16 animate-spin text-indigo-600' />
        </div>
      </div>
    )
  }

  if (doctorError || !doctorData) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white p-6'>
        <div className='container mx-auto max-w-4xl py-8'>
          <Card className='border-none shadow-lg rounded-xl overflow-hidden'>
            <CardContent className='p-0'>
              <div className='bg-red-50 p-8 flex flex-col items-center justify-center text-center'>
                <div className='bg-white rounded-full p-4 shadow-md mb-6'>
                  <FileText className='h-12 w-12 text-red-500' />
                </div>
                <h2 className='text-2xl font-bold mb-4 text-slate-800'>Doctor Not Found</h2>
                <p className='text-slate-600 mb-6 max-w-md'>
                  The doctor you're looking for doesn't exist or was removed.
                </p>
                <Button
                  onClick={() => navigate(path.doctors)}
                  className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Doctors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const doctor = doctorData

  if (!doctor) {
    return null
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white'>
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <Button
          variant='ghost'
          onClick={() => navigate(path.doctors)}
          className='mb-6 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Doctors
        </Button>

        {/* Doctor Profile Card */}
        <Card className='mb-8 border-none rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-indigo-600 to-purple-700 h-32 md:h-48'></div>
          <CardContent className='p-0 relative'>
            <div className='flex flex-col md:flex-row'>
              {/* Left Side - Avatar and Buttons */}
              <div className='md:w-1/3 lg:w-1/4 flex flex-col items-center px-6 -mt-16 md:-mt-24 relative z-10'>
                <Avatar className='h-32 w-32 md:h-48 md:w-48 border-4 border-white rounded-full shadow-lg mb-4'>
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback className='text-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white'>
                    {doctor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='w-full space-y-3 mt-2'>
                  <Button
                    className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all py-6 rounded-xl'
                    onClick={() => navigate(`/appointments/book/${doctor._id}`)}
                  >
                    <Calendar className='mr-2 h-5 w-5' />
                    Book Appointment
                  </Button>

                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 py-6 rounded-xl'
                      >
                        <MessageCircle className='mr-2 h-5 w-5' />
                        Write a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='rounded-xl border-none shadow-2xl p-0 overflow-hidden max-w-md w-full'>
                      <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-6'>
                        <DialogTitle className='text-white text-xl'>Review Dr. {doctor.name}</DialogTitle>
                        <DialogDescription className='text-white/80'>
                          Share your experience to help others make informed decisions.
                        </DialogDescription>
                      </div>
                      <div className='p-6'>
                        <div className='space-y-6'>
                          <div className='space-y-2'>
                            <Label htmlFor='rating' className='text-slate-700 font-medium'>
                              Your Rating
                            </Label>
                            <div className='flex justify-center mt-2'>
                              {renderRatingSelector(reviewRating, setReviewRating)}
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='review' className='text-slate-700 font-medium'>
                              Your Review
                            </Label>
                            <Textarea
                              id='review'
                              placeholder='Tell us about your experience...'
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              rows={5}
                              className='border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg'
                            />
                          </div>
                        </div>
                        <DialogFooter className='mt-6 flex space-x-3'>
                          <DialogClose asChild>
                            <Button variant='outline' className='flex-1 border-slate-200 hover:bg-slate-50 rounded-lg'>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleSubmitReview}
                            disabled={!reviewContent.trim() || submitReviewMutation.isPending}
                            className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg'
                          >
                            {submitReviewMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Submit Review
                          </Button>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant='outline'
                    className='w-full border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl'
                  >
                    <Heart className='mr-2 h-5 w-5' />
                    Save to Favorites
                  </Button>
                </div>

                <div className='w-full mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
                  <h3 className='font-medium text-slate-700 mb-3 flex items-center'>
                    <Star className='h-4 w-4 text-indigo-500 mr-2' />
                    Patient Rating
                  </h3>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span className='text-3xl font-bold text-slate-800 mr-2'>{doctor.rating}</span>
                      <div className='text-sm text-slate-500'>out of 5</div>
                    </div>
                    {renderStars(doctor.rating)}
                  </div>
                  <p className='text-sm text-slate-500 mt-2'>Based on patient reviews</p>
                </div>
              </div>

              {/* Right Side - Doctor Info */}
              <div className='flex-1 p-6 md:p-8 bg-white'>
                <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-6'>
                  <div>
                    <div className='flex items-center mb-1'>
                      <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Dr. {doctor.name}</h1>
                      <Badge className='ml-3 bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 px-2 py-0.5 rounded-full'>
                        {doctor.specialization}
                      </Badge>
                    </div>
                    <div className='flex items-center mt-2'>
                      <Badge
                        variant='outline'
                        className='mr-2 bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 rounded-full flex items-center'
                      >
                        <BadgeCheck className='h-3 w-3 mr-1' />
                        Verified
                      </Badge>
                      <div className='flex items-center text-slate-600 text-sm'>
                        <Award className='mr-1 h-4 w-4 text-amber-500' />
                        <span>{doctor.experience} years experience</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex space-x-3 mt-4 md:mt-0'>
                    <Button variant='outline' size='sm' className='rounded-lg border-slate-200'>
                      <Share2 className='h-4 w-4 mr-1' />
                      Share
                    </Button>
                    <Button variant='outline' size='sm' className='rounded-lg border-slate-200'>
                      <Mail className='h-4 w-4 mr-1' />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Doctor Professional Quick Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div className='flex items-center bg-slate-50 p-3 rounded-lg'>
                    <div className='bg-indigo-100 p-2 rounded-full mr-3'>
                      <MapPin className='h-5 w-5 text-indigo-600' />
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Location</span>
                      <span className='text-sm font-medium'>{doctor.location}</span>
                    </div>
                  </div>

                  <div className='flex items-center bg-slate-50 p-3 rounded-lg'>
                    <div className='bg-purple-100 p-2 rounded-full mr-3'>
                      <Phone className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Contact</span>
                      <span className='text-sm font-medium'>{doctor.contact}</span>
                    </div>
                  </div>

                  <div className='flex items-center bg-slate-50 p-3 rounded-lg'>
                    <div className='bg-blue-100 p-2 rounded-full mr-3'>
                      <Calendar className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Available On</span>
                      <span className='text-sm font-medium'>{doctor.availability.join(', ')}</span>
                    </div>
                  </div>

                  <div className='flex items-center bg-slate-50 p-3 rounded-lg'>
                    <div className='bg-emerald-100 p-2 rounded-full mr-3'>
                      <Clock className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Office Hours</span>
                      <span className='text-sm font-medium'>Check availability for times</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <div className='mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100'>
                    <h3 className='text-md font-semibold text-slate-800 mb-2 flex items-center'>
                      <User className='mr-2 h-4 w-4 text-indigo-500' />
                      About Dr. {doctor.name}
                    </h3>
                    <p className='text-slate-600'>{doctor.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue='about' value={activeTab} onValueChange={setActiveTab} className='mt-8'>
          <TabsList className='grid w-full grid-cols-3 rounded-xl p-1 bg-indigo-50 gap-1'>
            <TabsTrigger
              value='about'
              className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md py-3'
            >
              <Stethoscope className='mr-2 h-4 w-4' />
              Professional Info
            </TabsTrigger>
            <TabsTrigger
              value='reviews'
              className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md py-3'
            >
              <Star className='mr-2 h-4 w-4' />
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value='availability'
              className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md py-3'
            >
              <Calendar className='mr-2 h-4 w-4' />
              Availability
            </TabsTrigger>
          </TabsList>

          {/* Professional Info Tab */}
          <TabsContent value='about' className='space-y-6 mt-6 mb-10'>
            <Card className='border-none rounded-xl shadow-md overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-3'>
                <CardTitle className='flex items-center text-slate-800'>
                  <GraduationCap className='mr-2 h-5 w-5 text-indigo-600' />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div className='bg-white p-4 rounded-lg border border-slate-100 shadow-sm'>
                  <h3 className='font-semibold text-slate-700 mb-2'>Qualification</h3>
                  <p className='text-slate-600'>{doctor.qualification}</p>
                </div>

                <div className='bg-white p-4 rounded-lg border border-slate-100 shadow-sm'>
                  <h3 className='font-semibold text-slate-700 mb-2'>Specialization</h3>
                  <p className='text-slate-600'>{doctor.specialization}</p>
                </div>

                <div className='bg-white p-4 rounded-lg border border-slate-100 shadow-sm'>
                  <h3 className='font-semibold text-slate-700 mb-2'>Experience</h3>
                  <p className='text-slate-600'>{doctor.experience} years</p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-none rounded-xl shadow-md overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-3'>
                <CardTitle className='flex items-center text-slate-800'>
                  <Building className='mr-2 h-5 w-5 text-indigo-600' />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div className='bg-white p-4 rounded-lg border border-slate-100 shadow-sm'>
                  <h3 className='font-semibold text-slate-700 mb-2'>Location</h3>
                  <p className='text-slate-600'>{doctor.location}</p>
                </div>

                <div className='bg-white p-4 rounded-lg border border-slate-100 shadow-sm'>
                  <h3 className='font-semibold text-slate-700 mb-2'>Contact</h3>
                  <p className='text-slate-600'>{doctor.contact}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value='reviews' className='mt-6 mb-10'>
            <Card className='border-none rounded-xl shadow-md overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex justify-between items-center'>
                <CardTitle className='flex items-center text-slate-800'>
                  <MessageSquare className='mr-2 h-5 w-5 text-indigo-600' />
                  Patient Reviews
                </CardTitle>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size='sm'
                      className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-sm'
                    >
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Write a Review
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardHeader>

              <CardContent className='p-6'>
                {isLoadingReviews ? (
                  <div className='flex justify-center py-8'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
                      <Loader2 className='relative h-10 w-10 animate-spin text-indigo-600' />
                    </div>
                  </div>
                ) : reviewsData?.reviews?.length === 0 ? (
                  <div className='text-center py-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl'>
                    <div className='bg-white rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-sm'>
                      <MessageSquare className='h-8 w-8 text-indigo-400' />
                    </div>
                    <h3 className='text-xl font-bold mb-2 text-slate-800'>No Reviews Yet</h3>
                    <p className='text-slate-600 mb-6 max-w-md mx-auto'>Be the first to review Dr. {doctor.name}</p>
                    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg'>
                          Write a Review
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {reviewsData?.reviews?.map((review) => (
                      <div
                        key={review._id}
                        className='p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300'
                      >
                        <div className='flex justify-between items-start mb-3'>
                          <div className='flex items-center'>
                            <Avatar className='h-10 w-10 mr-3 ring-2 ring-indigo-100'>
                              <AvatarFallback className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white'>
                                {review.user_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className='font-semibold text-slate-800'>{review.user_name}</span>
                              <div className='text-xs text-slate-500 mt-1'>
                                {new Date(review.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center bg-amber-50 px-3 py-1 rounded-full'>
                            {renderStars(review.rating)}
                            <span className='ml-1 font-medium text-amber-600'>{review.rating}</span>
                          </div>
                        </div>
                        <div className='bg-slate-50 p-4 rounded-lg'>
                          <p className='text-slate-600'>{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              {reviewsData?.pagination && reviewsData.pagination.totalPages > 1 && (
                <CardFooter className='bg-gradient-to-r from-indigo-50 to-purple-50 p-4'>
                  <div className='flex justify-center w-full'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg'
                    >
                      Load More Reviews
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value='availability' className='mt-6 mb-10'>
            <ModernAvailabilityTab doctorId={doctor._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Separate component for availability tab to handle its own state
const ModernAvailabilityTab = ({ doctorId }: any) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(
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
    <Card className='border-none rounded-xl shadow-md overflow-hidden'>
      <CardHeader className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10'>
        <CardTitle className='flex items-center text-slate-800'>
          <Calendar className='mr-2 h-5 w-5 text-indigo-600' />
          Availability Calendar
        </CardTitle>
        <CardDescription className='text-slate-600'>Select a date to see available appointment slots</CardDescription>
      </CardHeader>

      <CardContent className='p-6 space-y-8'>
        <div className='bg-white p-4 rounded-xl border border-slate-100 shadow-sm'>
          <h3 className='text-sm font-medium text-slate-700 mb-4'>Select Date</h3>
          <div className='grid grid-cols-2 md:grid-cols-7 gap-2'>
            {next14Days.slice(0, 7).map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? 'default' : 'outline'}
                className={`text-xs flex flex-col h-auto py-3 rounded-lg ${
                  selectedDate === date.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
                onClick={() => setSelectedDate(date.value)}
              >
                <span className='font-bold'>{date.label.split(',')[0]}</span>
                <span>{date.label.split(',')[1]}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-slate-100 shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
            <Clock className='mr-2 h-5 w-5 text-indigo-500' />
            Available Time Slots
            <span className='ml-2 text-sm font-normal text-slate-500'>
              for{' '}
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </h3>

          {isLoading ? (
            <div className='flex justify-center py-10'>
              <div className='relative'>
                <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
                <Loader2 className='relative h-8 w-8 animate-spin text-indigo-600' />
              </div>
            </div>
          ) : !data?.available_times || data.available_times.length === 0 ? (
            <div className='text-center py-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl'>
              <div className='bg-white rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-sm'>
                <Calendar className='h-8 w-8 text-indigo-400' />
              </div>
              <h3 className='text-xl font-bold mb-2 text-slate-800'>No Available Slots</h3>
              <p className='text-slate-600 mb-6 max-w-md mx-auto'>Try another date or contact the doctor directly</p>
              <Button
                variant='outline'
                className='border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg'
                onClick={() => {
                  // Select next day
                  const currentDateObj = new Date(selectedDate)
                  currentDateObj.setDate(currentDateObj.getDate() + 1)
                  setSelectedDate(currentDateObj.toISOString().split('T')[0])
                }}
              >
                Try Next Day
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
              {data.available_times.map((time) => (
                <Button
                  key={time}
                  variant='outline'
                  className='text-sm py-6 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg transition-all'
                  onClick={() => navigate(`/appointments/book/${doctorId}?date=${selectedDate}&time=${time}`)}
                >
                  <Clock className='mr-2 h-4 w-4 text-indigo-500' />
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className='flex justify-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50'>
        <Button
          onClick={() => navigate(`/appointments/book/${doctorId}`)}
          className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all py-6 px-8 rounded-lg'
        >
          <Calendar className='mr-2 h-5 w-5' />
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DoctorDetailPage
