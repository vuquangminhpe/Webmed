// server/src/services/feedback.services.ts
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import Feedback from '~/models/schemas/Feedback.schema'
import { CreateFeedbackReqBody } from '~/models/request/Feedback.request'
import databaseService from './database.services'
import { WEBMED_MESSAGES } from '~/constant/messages'
import HTTP_STATUS from '~/constant/httpStatus'

class FeedbackService {
  async getAllFeedbacks(page: number = 1, limit: number = 10, feedbackType?: string) {
    const skip = (page - 1) * limit

    const query: Partial<{ feedback_type: 'website' | 'doctor' | 'medicine' | 'service' }> = feedbackType
      ? { feedback_type: feedbackType as 'website' | 'doctor' | 'medicine' | 'service' }
      : {}

    const [feedbacks, totalFeedbacks] = await Promise.all([
      databaseService.feedbacks.find(query).skip(skip).limit(limit).sort({ created_at: -1 }).toArray(),
      databaseService.feedbacks.countDocuments(query)
    ])

    return {
      feedbacks,
      pagination: {
        page,
        limit,
        totalFeedbacks,
        totalPages: Math.ceil(totalFeedbacks / limit)
      }
    }
  }

  async getFeedbackById(feedbackId: string) {
    const feedback = await databaseService.feedbacks.findOne({ _id: new ObjectId(feedbackId) })

    if (!feedback) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.FEEDBACK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return feedback
  }

  async createFeedback(userId: string, feedbackData: CreateFeedbackReqBody) {
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      throw new ErrorWithStatus({
        message: 'Rating must be between 1 and 5',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    if (feedbackData.related_id) {
      let relatedExists = false

      switch (feedbackData.feedback_type) {
        case 'doctor':
          relatedExists = !!(await databaseService.doctors.findOne({
            _id: new ObjectId(feedbackData.related_id)
          }))
          break
        case 'medicine':
          relatedExists = !!(await databaseService.medicines.findOne({
            _id: new ObjectId(feedbackData.related_id)
          }))
          break
        case 'website':
        case 'service':
          relatedExists = true
          break
      }

      if (!relatedExists) {
        throw new ErrorWithStatus({
          message: `Related ${feedbackData.feedback_type} not found`,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }

    const feedback = new Feedback({
      user_id: new ObjectId(userId),
      content: feedbackData.content,
      rating: feedbackData.rating,
      feedback_type: feedbackData.feedback_type,
      related_id: feedbackData.related_id ? new ObjectId(feedbackData.related_id) : undefined
    })

    await databaseService.feedbacks.insertOne(feedback)

    return feedback
  }

  async updateFeedback(feedbackId: string, userId: string, updatedData: Partial<CreateFeedbackReqBody>) {
    const existingFeedback = await databaseService.feedbacks.findOne({
      _id: new ObjectId(feedbackId),
      user_id: new ObjectId(userId)
    })

    if (!existingFeedback) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.FEEDBACK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (updatedData.rating && (updatedData.rating < 1 || updatedData.rating > 5)) {
      throw new ErrorWithStatus({
        message: 'Rating must be between 1 and 5',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await databaseService.feedbacks.findOneAndUpdate(
      { _id: new ObjectId(feedbackId) },
      {
        $set: {
          ...updatedData,
          related_id: updatedData.related_id ? new ObjectId(updatedData.related_id) : existingFeedback.related_id
        },
        $currentDate: {
          updated_at: true
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async deleteFeedback(feedbackId: string, userId: string) {
    const existingFeedback = await databaseService.feedbacks.findOne({
      _id: new ObjectId(feedbackId),
      user_id: new ObjectId(userId)
    })

    if (!existingFeedback) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.FEEDBACK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.feedbacks.deleteOne({ _id: new ObjectId(feedbackId) })

    return { message: WEBMED_MESSAGES.FEEDBACK_DELETED }
  }

  async getUserFeedbacks(userId: string) {
    const feedbacks = await databaseService.feedbacks
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .toArray()

    return feedbacks
  }
}

const feedbackService = new FeedbackService()
export default feedbackService
