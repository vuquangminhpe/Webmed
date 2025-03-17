import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import doctorApi from '@/apis/doctors.api'

interface DoctorSearchParams {
  page: number
  limit: number
  name?: string
  specialization?: string
  location?: string
}

export const useDoctors = (params: DoctorSearchParams) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => doctorApi.getDoctors(params).then((res) => res.data.result),
    placeholderData: keepPreviousData
  })
}

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorApi.getDoctorById(id).then((res) => res.data.result),
    enabled: Boolean(id)
  })
}

export const useBookAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { doctor_id: string; date: string; time: string; reason: string }) =>
      doctorApi.bookAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment booked successfully')
    },
    onError: () => {
      toast.error('Failed to book appointment')
    }
  })
}

export const useUserAppointments = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['appointments', page, limit],
    queryFn: () => doctorApi.getUserAppointments(page, limit).then((res) => res.data.result)
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentId: string) => doctorApi.cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel appointment')
    }
  })
}
