export interface Feedback {
  _id: string
  user_id: string
  content: string
  rating: number
  feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
  related_id?: string
  created_at: string
  updated_at: string
}
