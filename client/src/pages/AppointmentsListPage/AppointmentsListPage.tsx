import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Search,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  PhoneCall,
  CalendarCheck
} from 'lucide-react'
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
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white'>
      <div className='container py-12 px-4 mx-auto max-w-6xl'>
        {/* Header */}
        <div className='flex flex-col items-center justify-center space-y-6 text-center mb-12'>
          <div className='relative'>
            <div className='absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full'></div>
            <div className='relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg'>
              <Calendar className='h-10 w-10 text-white' />
            </div>
          </div>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            My Appointments
          </h1>
          <p className='mx-auto max-w-[700px] text-slate-600 text-lg md:text-xl'>
            View and manage all your upcoming and past medical appointments
          </p>
        </div>

        {/* Search and Filter */}
        <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8 bg-white p-4 rounded-xl shadow-md'>
          <div className='flex items-center space-x-2 md:w-1/2'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-indigo-500' />
              <Input
                type='search'
                placeholder='Search by doctor name...'
                className='pl-12 py-6 border-slate-200 bg-slate-50 hover:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <span className='text-sm font-medium text-slate-700'>Filter by:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[200px] border-slate-200 bg-slate-50 hover:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent className='rounded-lg border-slate-200 shadow-xl'>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='confirmed'>Confirmed</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <Tabs defaultValue='upcoming' className='mb-8'>
            <TabsList className='grid w-full grid-cols-2 rounded-lg p-1 bg-indigo-50 gap-1'>
              <TabsTrigger
                value='upcoming'
                className='rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md py-3'
              >
                <CalendarCheck className='mr-2 h-4 w-4' />
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value='past'
                className='rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md py-3'
              >
                <Clock className='mr-2 h-4 w-4' />
                Past & Cancelled
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Appointments Tab */}
            <TabsContent value='upcoming' className='mt-8'>
              {isLoadingAppointments ? (
                <div className='flex justify-center py-12'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
                    <Loader2 className='relative h-12 w-12 animate-spin text-indigo-600' />
                  </div>
                </div>
              ) : filteredAppointments.filter((a) => ['pending', 'confirmed'].includes(a.status)).length === 0 ? (
                <Card className='overflow-hidden border-none shadow-lg bg-gradient-to-b from-white to-indigo-50'>
                  <CardContent className='p-0'>
                    <div className='text-center py-16 px-4'>
                      <div className='mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6'>
                        <Calendar className='h-12 w-12 text-indigo-500' />
                      </div>
                      <h3 className='text-2xl font-bold mb-3 text-slate-800'>No Upcoming Appointments</h3>
                      <p className='text-slate-600 max-w-md mx-auto mb-8'>
                        You don't have any upcoming appointments scheduled. Book an appointment with a doctor to get
                        started.
                      </p>
                      <Button
                        onClick={() => navigate(path.doctors)}
                        className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-6 rounded-lg shadow-md hover:shadow-lg transition-all'
                      >
                        Find a Doctor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-6'>
                  {filteredAppointments
                    .filter((a) => ['pending', 'confirmed'].includes(a.status))
                    .map((appointment) => (
                      <Card
                        key={appointment._id}
                        className='overflow-hidden border-none rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
                      >
                        <CardContent className='p-0'>
                          <div className='flex flex-col md:flex-row'>
                            <div className='w-full md:w-1/4 relative overflow-hidden'>
                              <div
                                className={`
                              absolute inset-0 
                              ${appointment.status === 'pending' ? 'bg-gradient-to-br from-amber-200 to-amber-100' : 'bg-gradient-to-br from-emerald-200 to-emerald-100'}
                            `}
                              ></div>
                              <div className='relative p-8 flex flex-col justify-center items-center text-center h-full'>
                                <div className='mb-4 bg-white rounded-full p-3 shadow-md'>
                                  {getStatusIcon(appointment.status)}
                                </div>
                                <h3 className='font-bold text-xl mb-1 text-slate-800'>
                                  {new Date(appointment.date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </h3>
                                <p className='text-slate-700 font-medium'>{appointment.time}</p>
                                <div className='mt-4'>{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>

                            <div className='p-8 flex-1 bg-white'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                                {appointment.doctor && (
                                  <div className='flex items-center mb-4 sm:mb-0'>
                                    <Avatar className='h-14 w-14 mr-4 ring-2 ring-indigo-100 ring-offset-2'>
                                      <AvatarImage src={appointment.doctor.avatar} />
                                      <AvatarFallback className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold'>
                                        {appointment.doctor.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className='font-bold text-lg text-slate-800'>
                                        Dr. {appointment.doctor.name}
                                      </h3>
                                      <p className='text-indigo-600 font-medium'>{appointment.doctor.specialization}</p>
                                    </div>
                                  </div>
                                )}
                                <div className='flex space-x-3'>
                                  <div className='flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full'>
                                    <MapPin className='h-4 w-4 mr-1 text-slate-500' />
                                    <span className='text-sm'>{appointment.doctor?.location || 'Clinic'}</span>
                                  </div>
                                  <div className='flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full'>
                                    <PhoneCall className='h-4 w-4 mr-1 text-slate-500' />
                                    <span className='text-sm'>Contact</span>
                                  </div>
                                </div>
                              </div>

                              <div className='space-y-4'>
                                <div className='bg-slate-50 p-4 rounded-lg border border-slate-100'>
                                  <h4 className='text-sm font-semibold text-slate-700 mb-2'>Reason for Visit</h4>
                                  <p className='text-slate-600'>{appointment.reason}</p>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6'>
                                  <Button
                                    variant='outline'
                                    className='bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm hover:shadow transition-all rounded-lg'
                                    onClick={() => navigate(`/appointments/${appointment._id}`)}
                                  >
                                    View Details
                                  </Button>

                                  {appointment.status !== 'cancelled' && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant='destructive'
                                          className='bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-sm hover:shadow transition-all rounded-lg'
                                          onClick={() => setAppointmentToCancel(appointment._id)}
                                        >
                                          Cancel Appointment
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className='rounded-xl border-none shadow-2xl p-0 overflow-hidden max-w-lg'>
                                        <div className='bg-gradient-to-r from-rose-500 to-red-500 p-6'>
                                          <DialogTitle className='text-white text-xl'>Cancel Appointment</DialogTitle>
                                        </div>
                                        <div className='p-6'>
                                          <DialogDescription className='text-slate-600 text-base mb-6'>
                                            Are you sure you want to cancel this appointment with Dr.{' '}
                                            {appointment.doctor?.name} on{' '}
                                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}?
                                          </DialogDescription>
                                          <DialogFooter className='flex space-x-4'>
                                            <DialogClose asChild>
                                              <Button
                                                variant='outline'
                                                className='flex-1 border-slate-200 hover:bg-slate-50 rounded-lg'
                                              >
                                                Keep Appointment
                                              </Button>
                                            </DialogClose>
                                            <Button
                                              variant='destructive'
                                              onClick={handleCancelAppointment}
                                              disabled={cancelAppointmentMutation.isPending}
                                              className='flex-1 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 rounded-lg'
                                            >
                                              {cancelAppointmentMutation.isPending && (
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                              )}
                                              Yes, Cancel
                                            </Button>
                                          </DialogFooter>
                                        </div>
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

            {/* Past Appointments Tab */}
            <TabsContent value='past' className='mt-8'>
              {isLoadingAppointments ? (
                <div className='flex justify-center py-12'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-indigo-400 blur-md opacity-20 rounded-full'></div>
                    <Loader2 className='relative h-12 w-12 animate-spin text-indigo-600' />
                  </div>
                </div>
              ) : filteredAppointments.filter((a) => ['completed', 'cancelled'].includes(a.status)).length === 0 ? (
                <Card className='overflow-hidden border-none shadow-lg bg-gradient-to-b from-white to-indigo-50'>
                  <CardContent className='p-0'>
                    <div className='text-center py-16 px-4'>
                      <div className='mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6'>
                        <Clock className='h-12 w-12 text-indigo-500' />
                      </div>
                      <h3 className='text-2xl font-bold mb-3 text-slate-800'>No Past Appointments</h3>
                      <p className='text-slate-600 max-w-md mx-auto mb-8'>
                        You don't have any past or cancelled appointments in your history yet.
                      </p>
                      <Button
                        onClick={() => navigate(path.doctors)}
                        className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-6 rounded-lg shadow-md hover:shadow-lg transition-all'
                      >
                        Find a Doctor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-6'>
                  {filteredAppointments
                    .filter((a) => ['completed', 'cancelled'].includes(a.status))
                    .map((appointment) => (
                      <Card
                        key={appointment._id}
                        className='overflow-hidden border-none rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
                      >
                        <CardContent className='p-0'>
                          <div className='flex flex-col md:flex-row'>
                            <div className='w-full md:w-1/4 relative overflow-hidden'>
                              <div
                                className={`
                              absolute inset-0 
                              ${appointment.status === 'completed' ? 'bg-gradient-to-br from-blue-200 to-blue-100' : 'bg-gradient-to-br from-red-200 to-red-100'}
                            `}
                              ></div>
                              <div className='relative p-8 flex flex-col justify-center items-center text-center h-full'>
                                <div className='mb-4 bg-white rounded-full p-3 shadow-md'>
                                  {getStatusIcon(appointment.status)}
                                </div>
                                <h3 className='font-bold text-xl mb-1 text-slate-800'>
                                  {new Date(appointment.date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </h3>
                                <p className='text-slate-700 font-medium'>{appointment.time}</p>
                                <div className='mt-4'>{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>

                            <div className='p-8 flex-1 bg-white'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                                {appointment.doctor && (
                                  <div className='flex items-center mb-4 sm:mb-0'>
                                    <Avatar className='h-14 w-14 mr-4 ring-2 ring-indigo-100 ring-offset-2'>
                                      <AvatarImage src={appointment.doctor.avatar} />
                                      <AvatarFallback className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold'>
                                        {appointment.doctor.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className='font-bold text-lg text-slate-800'>
                                        Dr. {appointment.doctor.name}
                                      </h3>
                                      <p className='text-indigo-600 font-medium'>{appointment.doctor.specialization}</p>
                                    </div>
                                  </div>
                                )}
                                <div className='flex space-x-3'>
                                  <div className='flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full'>
                                    <MapPin className='h-4 w-4 mr-1 text-slate-500' />
                                    <span className='text-sm'>{appointment.doctor?.location || 'Clinic'}</span>
                                  </div>
                                  <div className='flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full'>
                                    <PhoneCall className='h-4 w-4 mr-1 text-slate-500' />
                                    <span className='text-sm'>Contact</span>
                                  </div>
                                </div>
                              </div>

                              <div className='space-y-4'>
                                <div className='bg-slate-50 p-4 rounded-lg border border-slate-100'>
                                  <h4 className='text-sm font-semibold text-slate-700 mb-2'>Reason for Visit</h4>
                                  <p className='text-slate-600'>{appointment.reason}</p>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6'>
                                  <Button
                                    variant='outline'
                                    className='bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm hover:shadow transition-all rounded-lg'
                                    onClick={() => navigate(`/appointments/${appointment._id}`)}
                                  >
                                    View Details
                                  </Button>

                                  {appointment.status === 'completed' && (
                                    <Button
                                      className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm hover:shadow transition-all rounded-lg'
                                      onClick={() => navigate(`${path.doctors}/${appointment.doctor_id}/reviews`)}
                                    >
                                      <Star className='mr-2 h-4 w-4' />
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

          {/* Pagination */}
          {appointmentsData?.pagination && appointmentsData.pagination.totalPages > 1 && (
            <div className='mt-10 flex justify-center'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={`rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all ${
                        currentPage === 1 || isLoadingAppointments ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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
                        <PaginationLink
                          isActive={currentPage === pageToShow}
                          onClick={() => setCurrentPage(pageToShow)}
                          className={`rounded-lg ${
                            currentPage === pageToShow
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-md'
                              : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                          } transition-all`}
                        >
                          {pageToShow}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, appointmentsData.pagination.totalPages))
                      }
                      className={`rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all ${
                        currentPage === appointmentsData.pagination.totalPages || isLoadingAppointments
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      aria-disabled={currentPage === appointmentsData.pagination.totalPages || isLoadingAppointments}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentsListPage
