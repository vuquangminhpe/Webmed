/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Calendar, Clock, User, FileText, Loader2, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useDoctor, useBookAppointment } from '@/hooks/useDoctor'
import doctorApi from '@/apis/doctors.api'
import path from '@/constants/path'
import { toast } from 'sonner'

const AppointmentBookingPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>()
  const [searchParams] = useSearchParams()
  const initialDate = searchParams.get('date') || ''
  const initialTime = searchParams.get('time') || ''

  const navigate = useNavigate()

  const [date, setDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0])
  const [time, setTime] = useState<string>(initialTime)
  const [reason, setReason] = useState<string>('')
  const [stage, setStage] = useState<'select-time' | 'provide-details' | 'review' | 'confirmation'>(
    initialTime ? 'provide-details' : 'select-time'
  )

  // Get doctor details
  const { data: doctorData, isLoading: isLoadingDoctor, error: doctorError } = useDoctor(doctorId || '')

  // Get availability
  const { data: availabilityData, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['doctor-availability', doctorId, date],
    queryFn: () => doctorApi.getDoctorAvailability(doctorId || '', date).then((res) => res.data.result),
    enabled: !!doctorId && !!date
  })

  // Book appointment mutation
  const bookAppointmentMutation = useBookAppointment()

  // Generate dates for the next 14 days
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  })

  const handleSelectTime = (selectedTime: string) => {
    setTime(selectedTime)
    setStage('provide-details')
  }

  const handleBack = () => {
    if (stage === 'provide-details') {
      setStage('select-time')
    } else if (stage === 'review') {
      setStage('provide-details')
    }
  }

  const handleNext = () => {
    if (stage === 'provide-details') {
      setStage('review')
    }
  }

  const handleBookAppointment = () => {
    if (!doctorId || !date || !time || !reason.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }

    bookAppointmentMutation.mutate(
      {
        doctor_id: doctorId,
        date,
        time,
        reason
      },
      {
        onSuccess: () => {
          setStage('confirmation')
        },
        onError: () => {
          toast.error('There was an error booking your appointment. Please try again.')
        }
      }
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

  if (stage === 'confirmation') {
    return (
      <div className='container py-10 max-w-md mx-auto'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center p-6 pt-10'>
            <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6'>
              <CheckCircle className='h-10 w-10 text-primary' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Appointment Booked!</h2>
            <p className='text-center text-muted-foreground mb-6'>
              Your appointment with Dr. {doctor.name} has been successfully booked for{' '}
              {new Date(date).toLocaleDateString()} at {time}.
            </p>
            <div className='flex flex-col w-full space-y-4'>
              <Button onClick={() => navigate('/appointments')} className='w-full'>
                View My Appointments
              </Button>
              <Button onClick={() => navigate(path.doctors)} variant='outline' className='w-full'>
                Back to Doctors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-6 flex items-center'>
          <Button variant='ghost' onClick={() => navigate(`${path.doctors}/${doctorId}`)}>
            <X className='h-4 w-4 mr-2' />
            Cancel
          </Button>
          <h1 className='text-2xl font-bold flex-1 text-center'>Book an Appointment</h1>
          <div className='w-24'></div> {/* For layout balance */}
        </div>

        <Card className='mb-6'>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Avatar className='h-12 w-12 mr-4'>
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className='font-medium'>{doctor.name}</h2>
                <div className='flex items-center mt-1'>
                  <Badge variant='outline' className='mr-2'>
                    {doctor.specialization}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {stage === 'select-time' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Appointment Date & Time</CardTitle>
              <CardDescription>Choose an available time slot that works for you</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-sm font-medium mb-3'>Date</h3>
                <div className='grid grid-cols-2 md:grid-cols-7 gap-2'>
                  {next14Days.slice(0, 7).map((d) => (
                    <Button
                      key={d.value}
                      variant={date === d.value ? 'default' : 'outline'}
                      className='text-xs flex flex-col h-auto py-2'
                      onClick={() => setDate(d.value)}
                    >
                      <span>{d.label.split(',')[0]}</span>
                      <span>{d.label.split(',')[1]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <h3 className='text-sm font-medium mb-3'>Available Time Slots</h3>

                {isLoadingAvailability ? (
                  <div className='flex justify-center py-4'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  </div>
                ) : !availabilityData?.available_times || availabilityData.available_times.length === 0 ? (
                  <div className='text-center py-8 border rounded-md'>
                    <Calendar className='mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>No Available Slots</h3>
                    <p className='text-muted-foreground mb-4'>Try another date or contact the doctor directly</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                    {availabilityData.available_times.map((t: string) => (
                      <Button
                        key={t}
                        variant={time === t ? 'default' : 'outline'}
                        className='text-sm'
                        onClick={() => handleSelectTime(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {stage === 'provide-details' && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Please provide additional details for your appointment on {new Date(date).toLocaleDateString()} at{' '}
                {time}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <h3 className='text-sm font-medium'>Reason for Visit</h3>
                <Textarea
                  placeholder='Please describe your reason for this appointment'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline' onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!reason.trim()}>
                Review & Confirm
              </Button>
            </CardFooter>
          </Card>
        )}

        {stage === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Confirm</CardTitle>
              <CardDescription>Please verify your appointment details before confirming</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Doctor:</span>
                  <span className='font-medium'>{doctor.name}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Specialization:</span>
                  <span>{doctor.specialization}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Date:</span>
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Time:</span>
                  <span>{time}</span>
                </div>
                <Separator />
                <div>
                  <span className='text-muted-foreground'>Reason for Visit:</span>
                  <p className='mt-2'>{reason}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline' onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleBookAppointment} disabled={bookAppointmentMutation.isPending}>
                {bookAppointmentMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AppointmentBookingPage
