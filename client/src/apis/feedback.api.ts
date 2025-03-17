import { Feedback } from '@/types/Feedback.type'
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'

interface FeedbackListResponse {
  feedbacks: Feedback[]
  pagination: {
    page: number
    limit: number
    totalFeedbacks: number
    totalPages: number
  }
}

const feedbackApi = {
  getFeedbacks: (page: number = 1, limit: number = 10, type?: string) =>
    http.get<SuccessResponse<FeedbackListResponse>>('/feedback/feedbacks', {
      params: {
        page,
        limit,
        type
      }
    }),

  getFeedbackById: (id: string) => http.get<SuccessResponse<Feedback>>(`/feedback/feedbacks/${id}`),

  createFeedback: (data: {
    content: string
    rating: number
    feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
    related_id?: string
  }) => http.post<SuccessResponse<Feedback>>('/feedback/feedbacks', data),

  updateFeedback: (id: string, data: Partial<Feedback>) =>
    http.put<SuccessResponse<Feedback>>(`/feedback/feedbacks/${id}`, data),

  deleteFeedback: (id: string) => http.delete<SuccessResponse<{ message: string }>>(`/feedback/feedbacks/${id}`),

  getUserFeedbacks: () => http.get<SuccessResponse<Feedback[]>>('/feedback/user/feedbacks')
}

export default feedbackApi
