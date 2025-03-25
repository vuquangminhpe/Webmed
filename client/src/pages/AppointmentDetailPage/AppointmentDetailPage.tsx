import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import doctorApi from '@/apis/doctors.api'
import { useCancelAppointment } from '@/hooks/useDoctor'
import path from '@/constants/path'
import { toast } from 'sonner'

const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Get appointment details
  const {
    data: appointmentData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => doctorApi.getAppointmentById(id || '').then((res) => res.data.result),
    enabled: !!id
  })

  // Cancel appointment mutation
  const cancelAppointmentMutation = useCancelAppointment()

  const handleCancelAppointment = () => {
    if (!id) return

    cancelAppointmentMutation.mutate(id, {
      onSuccess: () => {
        toast('Your appointment has been successfully cancelled.')
        setShowCancelDialog(false)
        refetch()
      },
      onError: () => {
        toast('Failed to cancel appointment. Please try again.')
      }
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          color: 'text-orange-500 border-orange-500',
          icon: <AlertCircle className='h-5 w-5 text-orange-500' />,
          description: 'Your appointment is awaiting confirmation from the doctor.'
        }
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'text-blue-500 border-blue-500',
          icon: <CheckCircle className='h-5 w-5 text-blue-500' />,
          description: 'Your appointment has been confirmed. Please arrive 15 minutes early.'
        }
      case 'completed':
        return {
          label: 'Completed',
          color: 'text-green-500 border-green-500',
          icon: <CheckCircle className='h-5 w-5 text-green-500' />,
          description: 'This appointment has been completed. Thank you for your visit.'
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'text-red-500 border-red-500',
          icon: <XCircle className='h-5 w-5 text-red-500' />,
          description: 'This appointment has been cancelled.'
        }
      default:
        return {
          label: status,
          color: '',
          icon: <FileText className='h-5 w-5' />,
          description: ''
        }
    }
  }

  if (isLoading) {
    return (
      <div className='container py-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
      </div>
    )
  }

  if (error || !appointmentData) {
    return (
      <div className='container py-10 max-w-3xl mx-auto'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <FileText className='h-12 w-12 text-destructive mb-4' />
            <h2 className='text-xl font-semibold mb-2'>Appointment Not Found</h2>
            <p className='text-muted-foreground mb-4'>
              The appointment you're looking for doesn't exist or was removed.
            </p>
            <Button onClick={() => navigate('/appointments')}>Back to Appointments</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const appointment = appointmentData
  const statusInfo = getStatusInfo(appointment.status)

  return (
    <div className='container py-10 max-w-3xl mx-auto'>
      <div className='mb-6'>
        <Button variant='ghost' onClick={() => navigate('/appointments')} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Appointments
        </Button>
        <h1 className='text-3xl font-bold'>Appointment Details</h1>
      </div>

      <Card className='mb-6'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <div className='mr-4'>{statusInfo.icon}</div>
              <div>
                <Badge className={statusInfo.color} variant='outline'>
                  {statusInfo.label}
                </Badge>
                <p className='text-sm text-muted-foreground mt-1'>{statusInfo.description}</p>
              </div>
            </div>

            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button variant='destructive' size='sm'>
                    Cancel Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this appointment? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className='mt-4'>
                    <DialogClose asChild>
                      <Button variant='outline'>Keep Appointment</Button>
                    </DialogClose>
                    <Button
                      variant='destructive'
                      onClick={handleCancelAppointment}
                      disabled={cancelAppointmentMutation.isPending}
                    >
                      {cancelAppointmentMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                      Yes, Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h2 className='text-lg font-semibold mb-4'>Appointment Information</h2>
              <div className='space-y-4'>
                <div className='flex'>
                  <Calendar className='h-5 w-5 text-muted-foreground mr-3' />
                  <div>
                    <h3 className='font-medium'>Date</h3>
                    <p className='text-muted-foreground'>
                      {new Date(appointment.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className='flex'>
                  <Clock className='h-5 w-5 text-muted-foreground mr-3' />
                  <div>
                    <h3 className='font-medium'>Time</h3>
                    <p className='text-muted-foreground'>{appointment.time}</p>
                  </div>
                </div>

                <div className='flex'>
                  <FileText className='h-5 w-5 text-muted-foreground mr-3' />
                  <div>
                    <h3 className='font-medium'>Reason for Visit</h3>
                    <p className='text-muted-foreground'>{appointment.reason}</p>
                  </div>
                </div>

                <div className='flex'>
                  <FileText className='h-5 w-5 text-muted-foreground mr-3' />
                  <div>
                    <h3 className='font-medium'>Booking Reference</h3>
                    <p className='text-muted-foreground'>#{appointment._id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {appointment.doctor && (
              <div>
                <h2 className='text-lg font-semibold mb-4'>Doctor Information</h2>
                <div className='flex items-center mb-4'>
                  <Avatar className='h-12 w-12 mr-4'>
                    <AvatarImage src={appointment.doctor.avatar} />
                    <AvatarFallback>{appointment.doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium'>Dr. {appointment.doctor.name}</h3>
                    <p className='text-sm text-muted-foreground'>{appointment.doctor.specialization}</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex'>
                    <MapPin className='h-5 w-5 text-muted-foreground mr-3' />
                    <div>
                      <h3 className='font-medium'>Location</h3>
                      <p className='text-muted-foreground'>{appointment.doctor.location}</p>
                    </div>
                  </div>

                  <div className='flex'>
                    <Phone className='h-5 w-5 text-muted-foreground mr-3' />
                    <div>
                      <h3 className='font-medium'>Contact</h3>
                      <p className='text-muted-foreground'>{appointment.doctor.contact}</p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <Button
                      className='w-full'
                      variant='outline'
                      onClick={() => navigate(`${path.doctors}/${appointment.doctor_id}`)}
                    >
                      View Doctor Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {appointment.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Share your experience with this doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>
              We'd love to hear about your experience with Dr. {appointment.doctor?.name}. Your feedback helps other
              patients make informed decisions.
            </p>
            <Button onClick={() => navigate(`${path.doctors}/${appointment.doctor_id}/reviews`)}>Write a Review</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AppointmentDetailPage
