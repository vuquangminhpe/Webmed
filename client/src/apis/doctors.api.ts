// Updated doctors.api.ts
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'

export interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  qualification: string
  location: string
  contact: string
  availability: string[]
  rating: number
  avatar?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  _id: string
  doctor_id: string
  user_id: string
  date: string
  time: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  doctor?: Doctor
}

interface DoctorListResponse {
  doctors: Doctor[]
  pagination: {
    page: number
    limit: number
    totalDoctors: number
    totalPages: number
  }
}

interface AppointmentListResponse {
  appointments: Appointment[]
  pagination: {
    page: number
    limit: number
    totalAppointments: number
    totalPages: number
  }
}

interface DoctorSearchParams {
  page?: number
  limit?: number
  name?: string
  specialization?: string
  location?: string
  availability?: string
  sort?: string
}

const doctorApi = {
  getDoctors: (params: DoctorSearchParams = {}) =>
    http.get<SuccessResponse<DoctorListResponse>>('/doctors', { params }),

  getDoctorById: (id: string) => http.get<SuccessResponse<Doctor>>(`/doctors/${id}`),

  bookAppointment: (data: { doctor_id: string; date: string; time: string; reason: string }) =>
    http.post<SuccessResponse<Appointment>>('/doctors/appointments', data),

  getUserAppointments: (page: number = 1, limit: number = 10) =>
    http.get<SuccessResponse<AppointmentListResponse>>('/doctors/appointments', {
      params: { page, limit }
    }),

  getAppointmentById: (id: string) => http.get<SuccessResponse<Appointment>>(`/doctors/appointments/${id}`),

  cancelAppointment: (id: string) =>
    http.post<SuccessResponse<{ message: string }>>(`/doctors/appointments/${id}/cancel`),

  getDoctorAvailability: (doctorId: string, date: string) =>
    http.get<SuccessResponse<{ available_times: string[] }>>(`/doctors/${doctorId}/availability`, {
      params: { date }
    }),

  getDoctorReviews: (doctorId: string, page: number = 1, limit: number = 10) =>
    http.get<
      SuccessResponse<{
        reviews: Array<{
          _id: string
          user_id: string
          doctor_id: string
          rating: number
          comment: string
          user_name: string
          created_at: string
        }>
        pagination: {
          page: number
          limit: number
          totalReviews: number
          totalPages: number
        }
      }>
    >(`/doctors/${doctorId}/reviews`, {
      params: { page, limit }
    }),

  submitDoctorReview: (
    doctorId: string,
    data: {
      rating: number
      comment: string
    }
  ) => http.post<SuccessResponse<{ message: string }>>(`/doctors/${doctorId}/reviews`, data),

  // New methods
  getSpecializations: () => http.get<SuccessResponse<string[]>>('/doctors/specializations'),

  getLocations: () => http.get<SuccessResponse<string[]>>('/doctors/locations'),

  searchDoctorsBySymptom: (symptom: string) =>
    http.get<SuccessResponse<Doctor[]>>('/doctors/search/symptom', {
      params: { symptom }
    }),

  getTopRatedDoctors: (limit: number = 5) =>
    http.get<SuccessResponse<Doctor[]>>('/doctors/top-rated', {
      params: { limit }
    })
}

export default doctorApi
