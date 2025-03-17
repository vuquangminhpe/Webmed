import { ObjectId } from 'mongodb'

interface FeedbackType {
  _id?: ObjectId
  user_id: ObjectId
  content: string
  rating: number
  feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
  related_id?: ObjectId // can be doctor_id, medicine_id, etc.
  created_at?: Date
  updated_at?: Date
}

export default class Feedback {
  _id?: ObjectId
  user_id: ObjectId
  content: string
  rating: number
  feedback_type: 'website' | 'doctor' | 'medicine' | 'service'
  related_id?: ObjectId
  created_at: Date
  updated_at: Date

  constructor(feedback: FeedbackType) {
    const date = new Date()
    this._id = feedback._id
    this.user_id = feedback.user_id
    this.content = feedback.content
    this.rating = feedback.rating
    this.feedback_type = feedback.feedback_type
    this.related_id = feedback.related_id
    this.created_at = feedback.created_at || date
    this.updated_at = feedback.updated_at || date
  }
}
