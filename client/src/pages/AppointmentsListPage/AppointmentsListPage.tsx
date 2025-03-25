import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Search, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserAppointments, useCancelAppointment } from '@/hooks/useDoctor'
import path from '@/constants/path'
import { toast } from 'sonner'

const AppointmentsListPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

  const { data: appointmentsData, isLoading: isLoadingAppointments, refetch } = useUserAppointments(currentPage, 10)

  const cancelAppointmentMutation = useCancelAppointment()

  const handleCancelAppointment = () => {
    if (!appointmentToCancel) return

    cancelAppointmentMutation.mutate(appointmentToCancel, {
      onSuccess: () => {
        toast('Appointment Cancelled')
        setAppointmentToCancel(null)
        refetch()
      },
      onError: () => {
        toast('Failed to cancel appointment. Please try again.')
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='outline' className='text-orange-500 border-orange-500'>
            Pending
          </Badge>
        )
      case 'confirmed':
        return (
          <Badge variant='outline' className='text-blue-500 border-blue-500'>
            Confirmed
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant='outline' className='text-green-500 border-green-500'>
            Completed
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant='outline' className='text-red-500 border-red-500'>
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className='h-5 w-5 text-orange-500' />
      case 'confirmed':
        return <CheckCircle className='h-5 w-5 text-blue-500' />
      case 'completed':
        return <CheckCircle className='h-5 w-5 text-green-500' />
      case 'cancelled':
        return <XCircle className='h-5 w-5 text-red-500' />
      default:
        return <FileText className='h-5 w-5' />
    }
  }

  // Filter appointments based on status and search query
  const filteredAppointments = appointmentsData?.appointments
    ? appointmentsData.appointments.filter((appointment) => {
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
        const matchesSearch =
          !searchQuery ||
          (appointment.doctor && appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesStatus && matchesSearch
      })
    : []

  return (
    <div className='container py-10'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center mb-8'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <Calendar className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>My Appointments</h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          View and manage all your upcoming and past appointments
        </p>
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6'>
        <div className='flex items-center space-x-2 md:w-1/2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search by doctor name...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>Filter by:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='confirmed'>Confirmed</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Tabs defaultValue='upcoming'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
            <TabsTrigger value='past'>Past & Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value='upcoming' className='mt-6'>
            {isLoadingAppointments ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            ) : filteredAppointments.filter((a) => ['pending', 'confirmed'].includes(a.status)).length === 0 ? (
              <div className='text-center py-12 border rounded-lg'>
                <Calendar className='mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4' />
                <h3 className='text-lg font-medium mb-2'>No Upcoming Appointments</h3>
                <p className='text-muted-foreground mb-6'>You don't have any upcoming appointments scheduled</p>
                <Button onClick={() => navigate(path.doctors)}>Find a Doctor</Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredAppointments
                  .filter((a) => ['pending', 'confirmed'].includes(a.status))
                  .map((appointment) => (
                    <Card key={appointment._id} className='overflow-hidden'>
                      <CardContent className='p-0'>
                        <div className='flex flex-col md:flex-row'>
                          <div className='w-full md:w-1/4 bg-muted p-6 flex flex-col justify-center items-center text-center'>
                            <div className='mb-2'>{getStatusIcon(appointment.status)}</div>
                            <h3 className='font-medium text-lg mb-1'>
                              {new Date(appointment.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </h3>
                            <p className='text-muted-foreground'>{appointment.time}</p>
                            <div className='mt-3'>{getStatusBadge(appointment.status)}</div>
                          </div>

                          <div className='p-6 flex-1'>
                            <div className='flex items-center mb-4'>
                              {appointment.doctor && (
                                <>
                                  <Avatar className='h-10 w-10 mr-3'>
                                    <AvatarImage src={appointment.doctor.avatar} />
                                    <AvatarFallback>{appointment.doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className='font-medium'>Dr. {appointment.doctor.name}</h3>
                                    <p className='text-sm text-muted-foreground'>{appointment.doctor.specialization}</p>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className='space-y-3'>
                              <div>
                                <h4 className='text-sm font-medium'>Reason for Visit</h4>
                                <p className='text-muted-foreground'>{appointment.reason}</p>
                              </div>

                              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => navigate(`/appointments/${appointment._id}`)}
                                >
                                  View Details
                                </Button>

                                {appointment.status !== 'cancelled' && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant='destructive'
                                        size='sm'
                                        onClick={() => setAppointmentToCancel(appointment._id)}
                                      >
                                        Cancel Appointment
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Cancel Appointment</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to cancel this appointment with Dr.{' '}
                                          {appointment.doctor?.name} on{' '}
                                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}?
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
                                          {cancelAppointmentMutation.isPending && (
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                          )}
                                          Yes, Cancel
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='past' className='mt-6'>
            {isLoadingAppointments ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            ) : filteredAppointments.filter((a) => ['completed', 'cancelled'].includes(a.status)).length === 0 ? (
              <div className='text-center py-12 border rounded-lg'>
                <Calendar className='mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4' />
                <h3 className='text-lg font-medium mb-2'>No Past Appointments</h3>
                <p className='text-muted-foreground mb-6'>You don't have any past or cancelled appointments</p>
                <Button onClick={() => navigate(path.doctors)}>Find a Doctor</Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredAppointments
                  .filter((a) => ['completed', 'cancelled'].includes(a.status))
                  .map((appointment) => (
                    <Card key={appointment._id} className='overflow-hidden'>
                      <CardContent className='p-0'>
                        <div className='flex flex-col md:flex-row'>
                          <div className='w-full md:w-1/4 bg-muted p-6 flex flex-col justify-center items-center text-center'>
                            <div className='mb-2'>{getStatusIcon(appointment.status)}</div>
                            <h3 className='font-medium text-lg mb-1'>
                              {new Date(appointment.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </h3>
                            <p className='text-muted-foreground'>{appointment.time}</p>
                            <div className='mt-3'>{getStatusBadge(appointment.status)}</div>
                          </div>

                          <div className='p-6 flex-1'>
                            <div className='flex items-center mb-4'>
                              {appointment.doctor && (
                                <>
                                  <Avatar className='h-10 w-10 mr-3'>
                                    <AvatarImage src={appointment.doctor.avatar} />
                                    <AvatarFallback>{appointment.doctor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className='font-medium'>Dr. {appointment.doctor.name}</h3>
                                    <p className='text-sm text-muted-foreground'>{appointment.doctor.specialization}</p>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className='space-y-3'>
                              <div>
                                <h4 className='text-sm font-medium'>Reason for Visit</h4>
                                <p className='text-muted-foreground'>{appointment.reason}</p>
                              </div>

                              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => navigate(`/appointments/${appointment._id}`)}
                                >
                                  View Details
                                </Button>

                                {appointment.status === 'completed' && (
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={() => navigate(`${path.doctors}/${appointment.doctor_id}/reviews`)}
                                  >
                                    Write a Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {appointmentsData?.pagination && appointmentsData.pagination.totalPages > 1 && (
          <Pagination className='mt-8'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage === 1 || isLoadingAppointments}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, appointmentsData.pagination.totalPages) }, (_, i) => {
                const pageToShow =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= appointmentsData.pagination.totalPages - 2
                      ? appointmentsData.pagination.totalPages - 4 + i
                      : currentPage - 2 + i

                return pageToShow > 0 && pageToShow <= appointmentsData.pagination.totalPages ? (
                  <PaginationItem key={pageToShow}>
                    <PaginationLink isActive={currentPage === pageToShow} onClick={() => setCurrentPage(pageToShow)}>
                      {pageToShow}
                    </PaginationLink>
                  </PaginationItem>
                ) : null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, appointmentsData.pagination.totalPages))}
                  aria-disabled={currentPage === appointmentsData.pagination.totalPages || isLoadingAppointments}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}

export default AppointmentsListPage
