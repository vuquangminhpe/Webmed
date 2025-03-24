import { ObjectId } from 'mongodb'

interface AppointmentType {
  _id?: ObjectId
  doctor_id: ObjectId
  user_id: ObjectId
  date: string
  time: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at?: Date
  updated_at?: Date
}

export default class Appointment {
  _id?: ObjectId
  doctor_id: ObjectId
  user_id: ObjectId
  date: string
  time: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: Date
  updated_at: Date

  constructor(appointment: AppointmentType) {
    const date = new Date()
    this._id = appointment._id
    this.doctor_id = appointment.doctor_id
    this.user_id = appointment.user_id
    this.date = appointment.date
    this.time = appointment.time
    this.reason = appointment.reason
    this.status = appointment.status
    this.created_at = appointment.created_at || date
    this.updated_at = appointment.updated_at || date
  }
}
