import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import feedbackService from '~/services/feedback.services'
import { TokenPayload } from '~/models/request/User.request'
import { CreateFeedbackReqBody } from '~/models/request/Feedback.request'
import { WEBMED_MESSAGES } from '~/constant/messages'

export const getAllFeedbacksController = async (req: Request, res: Response) => {
  const { page, limit, type } = req.query

  const result = await feedbackService.getAllFeedbacks(Number(page) || 1, Number(limit) || 10, type as string)

  return res.json({
    message: WEBMED_MESSAGES.FEEDBACK_LIST_SUCCESS,
    result
  })
}

export const getFeedbackByIdController = async (req: Request, res: Response) => {
  const { id } = req.params

  const feedback = await feedbackService.getFeedbackById(id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: feedback
  })
}

export const createFeedbackController = async (
  req: Request<ParamsDictionary, any, CreateFeedbackReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const feedbackData = req.body

  const feedback = await feedbackService.createFeedback(user_id, feedbackData)

  return res.status(201).json({
    message: WEBMED_MESSAGES.FEEDBACK_CREATED,
    result: feedback
  })
}

export const updateFeedbackController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params
  const updatedData = req.body

  const feedback = await feedbackService.updateFeedback(id, user_id, updatedData)

  return res.json({
    message: WEBMED_MESSAGES.FEEDBACK_UPDATED,
    result: feedback
  })
}

export const deleteFeedbackController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params

  const result = await feedbackService.deleteFeedback(id, user_id)

  return res.json(result)
}

export const getUserFeedbacksController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload

  const feedbacks = await feedbackService.getUserFeedbacks(user_id)

  return res.json({
    message: WEBMED_MESSAGES.FEEDBACK_LIST_SUCCESS,
    result: feedbacks
  })
}
