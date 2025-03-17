import feedbackApi from '@/apis/feedback.api'
import { Feedback } from '@/types/Feedback.type'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useFeedbacks = (page: number = 1, limit: number = 10, type?: string) => {
  return useQuery({
    queryKey: ['feedbacks', page, limit, type],
    queryFn: () => feedbackApi.getFeedbacks(page, limit, type).then((res) => res.data.result),
    placeholderData: keepPreviousData
  })
}

export const useFeedback = (id: string) => {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: () => feedbackApi.getFeedbackById(id).then((res) => res.data.result),
    enabled: Boolean(id)
  })
}

export const useUserFeedbacks = () => {
  return useQuery({
    queryKey: ['userFeedbacks'],
    queryFn: () => feedbackApi.getUserFeedbacks().then((res) => res.data.result)
  })
}

export const useCreateFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      content: string
      rating: number
      feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
      related_id?: string
    }) => feedbackApi.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
      queryClient.invalidateQueries({ queryKey: ['userFeedbacks'] })
      toast.success('Feedback submitted successfully!')
    }
  })
}

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Feedback> }) => feedbackApi.updateFeedback(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
      queryClient.invalidateQueries({ queryKey: ['feedback', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['userFeedbacks'] })
      toast.success('Feedback updated successfully!')
    }
  })
}

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => feedbackApi.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
      queryClient.invalidateQueries({ queryKey: ['userFeedbacks'] })
      toast.success('Feedback deleted successfully!')
    }
  })
}
