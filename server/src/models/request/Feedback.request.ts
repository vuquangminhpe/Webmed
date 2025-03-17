export interface CreateFeedbackReqBody {
  content: string
  rating: number
  feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
  related_id?: string
}
