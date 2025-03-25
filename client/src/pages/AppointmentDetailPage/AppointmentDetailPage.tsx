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
  ArrowLeft,
  Star
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
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white p-4'>
      <div className='container py-6 max-w-4xl mx-auto'>
        <div className='mb-8 flex items-center'>
          <Button
            variant='ghost'
            onClick={() => navigate('/appointments')}
            className='mr-4 hover:bg-indigo-100 transition-all duration-200'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              Appointment Details
            </h1>
            <p className='text-slate-500 mt-1'>Manage your upcoming medical appointment</p>
          </div>
        </div>

        <Card className='mb-8 border-none overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl'>
          <div className={`p-6 ${statusInfo.color}`}>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6'>
              <div className='flex items-center'>
                <div className='rounded-full bg-white p-3 shadow-md mr-4'>{statusInfo.icon}</div>
                <div>
                  <Badge className={`${statusInfo.color} px-4 py-1 text-sm font-semibold rounded-full`}>
                    {statusInfo.label}
                  </Badge>
                  <p className='text-sm text-slate-600 mt-2 font-medium'>{statusInfo.description}</p>
                </div>
              </div>

              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant='destructive'
                      size='sm'
                      className='bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-200'
                    >
                      Cancel Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='rounded-lg border-none shadow-2xl p-0 overflow-hidden max-w-md w-full'>
                    <div className='bg-gradient-to-r from-rose-500 to-red-500 p-6'>
                      <DialogTitle className='text-white text-xl'>Cancel Appointment</DialogTitle>
                    </div>
                    <div className='p-6'>
                      <DialogDescription className='text-slate-600 text-base mb-6'>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                      </DialogDescription>
                      <DialogFooter className='flex space-x-4'>
                        <DialogClose asChild>
                          <Button variant='outline' className='flex-1 border-slate-200 hover:bg-slate-50'>
                            Keep Appointment
                          </Button>
                        </DialogClose>
                        <Button
                          variant='destructive'
                          onClick={handleCancelAppointment}
                          disabled={cancelAppointmentMutation.isPending}
                          className='flex-1 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600'
                        >
                          {cancelAppointmentMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                          Yes, Cancel
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <CardContent className='p-6 bg-white'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300'>
                <h2 className='text-lg font-bold text-slate-800 mb-6 flex items-center'>
                  <span className='inline-block w-2 h-6 bg-indigo-500 rounded mr-3'></span>
                  Appointment Information
                </h2>
                <div className='space-y-6'>
                  <div className='flex items-start'>
                    <div className='bg-indigo-100 p-2 rounded-full mr-4'>
                      <Calendar className='h-5 w-5 text-indigo-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-700'>Date</h3>
                      <p className='text-slate-600 mt-1'>
                        {appointment.date
                          ? new Date(appointment.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <div className='bg-purple-100 p-2 rounded-full mr-4'>
                      <Clock className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-700'>Time</h3>
                      <p className='text-slate-600 mt-1'>{appointment.time || 'N/A'}</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <div className='bg-blue-100 p-2 rounded-full mr-4'>
                      <FileText className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-700'>Reason for Visit</h3>
                      <p className='text-slate-600 mt-1'>{appointment.reason || 'N/A'}</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <div className='bg-emerald-100 p-2 rounded-full mr-4'>
                      <FileText className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-700'>Booking Reference</h3>
                      <p className='text-slate-600 mt-1'>
                        {appointment._id ? `#${appointment._id.substring(0, 8).toUpperCase()}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {appointment.doctor && (
                <div className='bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300'>
                  <h2 className='text-lg font-bold text-slate-800 mb-6 flex items-center'>
                    <span className='inline-block w-2 h-6 bg-purple-500 rounded mr-3'></span>
                    Doctor Information
                  </h2>
                  <div className='flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm'>
                    <Avatar className='h-16 w-16 mr-4 ring-2 ring-indigo-200 ring-offset-2'>
                      <AvatarImage src={appointment.doctor.avatar} />
                      <AvatarFallback className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white'>
                        {appointment.doctor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-bold text-slate-800'>Dr. {appointment.doctor.name}</h3>
                      <p className='text-indigo-600 font-medium'>{appointment.doctor.specialization}</p>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div className='flex items-start'>
                      <div className='bg-rose-100 p-2 rounded-full mr-4'>
                        <MapPin className='h-5 w-5 text-rose-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-slate-700'>Location</h3>
                        <p className='text-slate-600 mt-1'>{appointment.doctor.location}</p>
                      </div>
                    </div>

                    <div className='flex items-start'>
                      <div className='bg-amber-100 p-2 rounded-full mr-4'>
                        <Phone className='h-5 w-5 text-amber-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-slate-700'>Contact</h3>
                        <p className='text-slate-600 mt-1'>{appointment.doctor.contact}</p>
                      </div>
                    </div>

                    <div className='mt-6'>
                      <Button
                        className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
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
          <Card className='border-none overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50'>
            <CardHeader className='pb-2 pt-6'>
              <CardTitle className='text-xl font-bold text-slate-800'>Share Your Experience</CardTitle>
              <CardDescription className='text-slate-600'>Your feedback helps other patients</CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='bg-white p-4 rounded-lg mb-6 border border-slate-100'>
                <p className='text-slate-700'>
                  We'd love to hear about your experience with Dr. {appointment.doctor?.name}. Your feedback helps other
                  patients make informed decisions.
                </p>
              </div>
              <Button
                onClick={() => navigate(`${path.doctors}/${appointment.doctor_id}/reviews`)}
                className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
              >
                <Star className='mr-2 h-4 w-4' />
                Write a Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AppointmentDetailPage
