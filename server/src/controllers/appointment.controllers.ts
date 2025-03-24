import { Request, Response } from 'express'
import appointmentService from '~/services/appointment.services'
import { TokenPayload } from '~/models/request/User.request'
import { WEBMED_MESSAGES } from '~/constant/messages'

export const bookAppointmentController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const appointmentData = req.body

  const appointment = await appointmentService.bookAppointment(user_id, appointmentData)

  return res.status(201).json({
    message: 'Appointment booked successfully',
    result: appointment
  })
}

export const getUserAppointmentsController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { page, limit } = req.query

  const result = await appointmentService.getUserAppointments(user_id, Number(page) || 1, Number(limit) || 10)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result
  })
}

export const getAppointmentByIdController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params

  const appointment = await appointmentService.getAppointmentById(id, user_id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: appointment
  })
}

export const cancelAppointmentController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params

  const result = await appointmentService.cancelAppointment(id, user_id)

  return res.json({
    message: 'Appointment cancelled successfully',
    result
  })
}
