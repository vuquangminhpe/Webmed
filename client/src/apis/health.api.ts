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

const healthApi = {
  getDiseases: (page: number = 1, limit: number = 10, search: string = '') =>
    http.get<SuccessResponse<DiseaseListResponse>>(`/health/diseases`, {
      params: {
        page,
        limit,
        search
      }
    }),

  getDiseaseById: (id: string) => http.get<SuccessResponse<Disease>>(`/health/diseases/${id}`),

  searchDiseasesBySymptoms: (symptoms: string[]) =>
    http.post<SuccessResponse<Disease[]>>('/health/diseases/search', { symptoms }),

  createDisease: (data: Omit<Disease, '_id' | 'created_at' | 'updated_at'>) =>
    http.post<SuccessResponse<Disease>>('/health/diseases', data),

  updateDisease: (id: string, data: Partial<Disease>) =>
    http.put<SuccessResponse<Disease>>(`/health/diseases/${id}`, data),

  deleteDisease: (id: string) => http.delete<SuccessResponse<{ message: string }>>(`/health/diseases/${id}`)
}

export default healthApi
