import { Request, Response } from 'express'
import doctorService from '~/services/doctor.services'
import { TokenPayload } from '~/models/request/User.request'
import { WEBMED_MESSAGES } from '~/constant/messages'

export const getDoctorsController = async (req: Request, res: Response) => {
  const { page, limit, name, specialization, location, availability, sort } = req.query

  const result = await doctorService.getDoctors({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    name: name as string,
    specialization: specialization as string,
    location: location as string,
    availability: availability as string,
    sort: sort as string
  })

  return res.json({
    message: WEBMED_MESSAGES.DOCTOR_LIST_SUCCESS,
    result
  })
}

export const getDoctorByIdController = async (req: Request, res: Response) => {
  const { id } = req.params

  const doctor = await doctorService.getDoctorById(id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: doctor
  })
}

export const getDoctorAvailabilityController = async (req: Request, res: Response) => {
  const { doctorId } = req.params
  const { date } = req.query

  if (!date) {
    return res.status(400).json({
      message: 'Date parameter is required'
    })
  }

  const availability = await doctorService.getDoctorAvailability(doctorId, date as string)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: availability
  })
}

export const getDoctorReviewsController = async (req: Request, res: Response) => {
  const { doctorId } = req.params
  const { page, limit } = req.query

  const result = await doctorService.getDoctorReviews(doctorId, Number(page) || 1, Number(limit) || 10)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result
  })
}

export const submitDoctorReviewController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { doctorId } = req.params
  const { rating, comment } = req.body

  const result = await doctorService.submitDoctorReview(user_id, doctorId, { rating, comment })

  return res.json({
    message: 'Review submitted successfully',
    result
  })
}

export const getSpecializationsController = async (req: Request, res: Response) => {
  const specializations = await doctorService.getDoctorSpecializations()

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: specializations
  })
}

export const getLocationsController = async (req: Request, res: Response) => {
  const locations = await doctorService.getDoctorLocations()

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: locations
  })
}

export const searchDoctorsBySymptomController = async (req: Request, res: Response) => {
  const { symptom } = req.query

  if (!symptom) {
    return res.status(400).json({
      message: 'Symptom parameter is required'
    })
  }

  const doctors = await doctorService.searchDoctorsBySymptom(symptom as string)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: doctors
  })
}

export const getTopRatedDoctorsController = async (req: Request, res: Response) => {
  const { limit } = req.query

  const doctors = await doctorService.getTopRatedDoctors(Number(limit) || 5)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: doctors
  })
}
