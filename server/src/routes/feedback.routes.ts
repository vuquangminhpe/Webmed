import { Router } from 'express'
import {
  createFeedbackController,
  deleteFeedbackController,
  getAllFeedbacksController,
  getFeedbackByIdController,
  getUserFeedbacksController,
  updateFeedbackController
} from '~/controllers/feedback.controllers'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const feedbackRouter = Router()

feedbackRouter.get('/feedbacks', wrapAsync(getAllFeedbacksController))
feedbackRouter.get('/feedbacks/:id', wrapAsync(getFeedbackByIdController))

feedbackRouter.post('/feedbacks', AccessTokenValidator, wrapAsync(createFeedbackController))

feedbackRouter.put('/feedbacks/:id', AccessTokenValidator, wrapAsync(updateFeedbackController))

feedbackRouter.delete(
  '/feedbacks/:id',
  AccessTokenValidator,

  wrapAsync(deleteFeedbackController)
)

feedbackRouter.get(
  '/user/feedbacks',
  AccessTokenValidator,

  wrapAsync(getUserFeedbacksController)
)

export default feedbackRouter
