// Updated health.api.ts
import { Disease } from '@/types/Disease.type'
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'

interface DiseaseListResponse {
  diseases: Disease[]
  pagination: {
    page: number
    limit: number
    totalDiseases: number
    totalPages: number
  }
}

interface DiseaseSearchParams {
  page?: number
  limit?: number
  search?: string
  category?: string
}

const healthApi = {
  getDiseases: (page: number, limit: number, search: string, params: DiseaseSearchParams = {}) =>
    http.get<SuccessResponse<DiseaseListResponse>>(`/health/diseases`, { params }),

  getDiseaseById: (id: string) => http.get<SuccessResponse<Disease>>(`/health/diseases/${id}`),

  searchDiseasesBySymptoms: (symptoms: string[]) =>
    http.post<SuccessResponse<Disease[]>>('/health/diseases/search', { symptoms }),

  // Enhanced version that accepts severity and duration
  searchDiseasesByDetailedSymptoms: (symptoms: Array<{ name: string; severity: string; duration: string }>) =>
    http.post<SuccessResponse<Disease[]>>('/health/diseases/search/detailed', { symptoms }),

  createDisease: (data: Omit<Disease, '_id' | 'created_at' | 'updated_at'>) =>
    http.post<SuccessResponse<Disease>>('/health/diseases', data),

  updateDisease: (id: string, data: Partial<Disease>) =>
    http.put<SuccessResponse<Disease>>(`/health/diseases/${id}`, data),

  deleteDisease: (id: string) => http.delete<SuccessResponse<{ message: string }>>(`/health/diseases/${id}`),

  // New method to get common symptoms
  getCommonSymptoms: () => http.get<SuccessResponse<string[]>>('/health/symptoms'),

  // New method to get symptom categories
  getSymptomCategories: () =>
    http.get<SuccessResponse<{ category: string; symptoms: string[] }[]>>('/health/symptoms/categories'),

  // New method to get emergency symptoms that require immediate attention
  getEmergencySymptoms: () => http.get<SuccessResponse<string[]>>('/health/symptoms/emergency')
}

export default healthApi
