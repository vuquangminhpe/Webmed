import { Router } from 'express'
import {
  getDoctorAvailabilityController,
  getDoctorByIdController,
  getDoctorReviewsController,
  getDoctorsController,
  getLocationsController,
  getSpecializationsController,
  getTopRatedDoctorsController,
  searchDoctorsBySymptomController,
  submitDoctorReviewController
} from '~/controllers/doctor.controllers'
import {
  bookAppointmentController,
  cancelAppointmentController,
  getAppointmentByIdController,
  getUserAppointmentsController
} from '~/controllers/appointment.controllers'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const doctorRouter = Router()

// Doctor routes
doctorRouter.get('/', wrapAsync(getDoctorsController))
doctorRouter.get('/specializations', wrapAsync(getSpecializationsController))
doctorRouter.get('/locations', wrapAsync(getLocationsController))
doctorRouter.get('/search/symptom', wrapAsync(searchDoctorsBySymptomController))
doctorRouter.get('/top-rated', wrapAsync(getTopRatedDoctorsController))
doctorRouter.get('/:id', wrapAsync(getDoctorByIdController))
doctorRouter.get('/:doctorId/availability', wrapAsync(getDoctorAvailabilityController))
doctorRouter.get('/:doctorId/reviews', wrapAsync(getDoctorReviewsController))
doctorRouter.post('/:doctorId/reviews', AccessTokenValidator, wrapAsync(submitDoctorReviewController))

// Appointment routes
doctorRouter.post('/appointments', AccessTokenValidator, wrapAsync(bookAppointmentController))
doctorRouter.get('/appointments', AccessTokenValidator, wrapAsync(getUserAppointmentsController))
doctorRouter.get('/appointments/:id', AccessTokenValidator, wrapAsync(getAppointmentByIdController))
doctorRouter.post('/appointments/:id/cancel', AccessTokenValidator, wrapAsync(cancelAppointmentController))

export default doctorRouter
