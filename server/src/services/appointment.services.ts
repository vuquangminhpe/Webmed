import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import Appointment from '~/models/schemas/Appointment.schema'
import databaseService from './database.services'
import { WEBMED_MESSAGES } from '~/constant/messages'
import HTTP_STATUS from '~/constant/httpStatus'
import doctorService from './doctor.services'

class AppointmentService {
  async bookAppointment(userId: string, data: { doctor_id: string; date: string; time: string; reason: string }) {
    // Check if doctor exists
    const doctor = await doctorService.getDoctorById(data.doctor_id)

    // Check if the time slot is available
    const availability = await doctorService.getDoctorAvailability(data.doctor_id, data.date)
    if (!availability.available_times.includes(data.time)) {
      throw new ErrorWithStatus({
        message: 'The selected time slot is not available',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Create the appointment
    const appointment = new Appointment({
      user_id: new ObjectId(userId),
      doctor_id: new ObjectId(data.doctor_id),
      date: data.date,
      time: data.time,
      reason: data.reason,
      status: 'pending'
    })

    await databaseService.appointments.insertOne(appointment)

    return appointment
  }

  async getUserAppointments(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [appointments, totalAppointments] = await Promise.all([
      databaseService.appointments
        .find({ user_id: new ObjectId(userId) })
        .sort({ date: -1, time: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.appointments.countDocuments({ user_id: new ObjectId(userId) })
    ])

    // Get doctor details for each appointment
    const appointmentsWithDoctors = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await databaseService.doctors.findOne({ _id: appointment.doctor_id })
        return {
          ...appointment,
          doctor
        }
      })
    )

    return {
      appointments: appointmentsWithDoctors,
      pagination: {
        page,
        limit,
        totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit)
      }
    }
  }

  async getAppointmentById(appointmentId: string, userId: string) {
    const appointment = await databaseService.appointments.findOne({
      _id: new ObjectId(appointmentId),
      user_id: new ObjectId(userId)
    })

    if (!appointment) {
      throw new ErrorWithStatus({
        message: 'Appointment not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Get doctor details
    const doctor = await databaseService.doctors.findOne({ _id: appointment.doctor_id })

    return {
      ...appointment,
      doctor
    }
  }

  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await databaseService.appointments.findOne({
      _id: new ObjectId(appointmentId),
      user_id: new ObjectId(userId)
    })

    if (!appointment) {
      throw new ErrorWithStatus({
        message: 'Appointment not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (appointment.status === 'cancelled') {
      throw new ErrorWithStatus({
        message: 'Appointment already cancelled',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (appointment.status === 'completed') {
      throw new ErrorWithStatus({
        message: 'Cannot cancel a completed appointment',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // In a real app, you might want to check if the appointment is within a cancellation window

    await databaseService.appointments.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: { status: 'cancelled' },
        $currentDate: { updated_at: true }
      }
    )

    return {
      message: 'Appointment cancelled successfully'
    }
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
