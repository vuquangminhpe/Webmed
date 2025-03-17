/* eslint-disable @typescript-eslint/no-unused-vars */
import healthApi from '@/apis/health.api'
import { Disease } from '@/types/Disease.type'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useDiseases = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery({
    queryKey: ['diseases', page, limit, search],
    queryFn: () => healthApi.getDiseases(page, limit, search).then((res) => res.data.result),
    placeholderData: keepPreviousData
  })
}

export const useDisease = (id: string) => {
  return useQuery({
    queryKey: ['disease', id],
    queryFn: () => healthApi.getDiseaseById(id).then((res) => res.data.result),
    enabled: Boolean(id)
  })
}

export const useSearchDiseasesBySymptoms = () => {
  return useMutation({
    mutationFn: (symptoms: string[]) => healthApi.searchDiseasesBySymptoms(symptoms),
    onSuccess: (data) => {
      console.log(data)
    }
  })
}

export const useCreateDisease = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Disease, '_id' | 'created_at' | 'updated_at'>) => healthApi.createDisease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] })
      toast.success('Disease created successfully!')
    }
  })
}

export const useUpdateDisease = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Disease> }) => healthApi.updateDisease(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] })
      queryClient.invalidateQueries({ queryKey: ['disease', variables.id] })
      toast.success('Disease updated successfully!')
    }
  })
}

export const useDeleteDisease = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => healthApi.deleteDisease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] })
      toast.success('Disease deleted successfully!')
    }
  })
}
