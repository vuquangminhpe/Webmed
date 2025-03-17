import { ObjectId } from 'mongodb'

interface DoctorType {
  _id?: ObjectId
  name: string
  specialization: string
  experience: number
  qualification: string
  location: string
  contact: string
  availability: string[]
  rating?: number
  created_at?: Date
  updated_at?: Date
}

export default class Doctor {
  _id?: ObjectId
  name: string
  specialization: string
  experience: number
  qualification: string
  location: string
  contact: string
  availability: string[]
  rating: number
  created_at: Date
  updated_at: Date

  constructor(doctor: DoctorType) {
    const date = new Date()
    this._id = doctor._id
    this.name = doctor.name
    this.specialization = doctor.specialization
    this.experience = doctor.experience
    this.qualification = doctor.qualification
    this.location = doctor.location
    this.contact = doctor.contact
    this.availability = doctor.availability
    this.rating = doctor.rating || 0
    this.created_at = doctor.created_at || date
    this.updated_at = doctor.updated_at || date
  }
}
