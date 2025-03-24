import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import Doctor from '~/models/schemas/Doctor.schema'
import Review from '~/models/schemas/Review.schema'
import databaseService from './database.services'
import { WEBMED_MESSAGES } from '~/constant/messages'
import HTTP_STATUS from '~/constant/httpStatus'
import User from '~/models/schemas/User.schema'

class DoctorService {
  async getDoctors(params: {
    page?: number
    limit?: number
    name?: string
    specialization?: string
    location?: string
    availability?: string
    sort?: string
  }) {
    const { page = 1, limit = 10, name, specialization, location, availability, sort } = params

    const skip = (page - 1) * limit

    // Build query based on filters
    const query: any = {}

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }
    }

    if (specialization) {
      query.specialization = { $regex: new RegExp(specialization, 'i') }
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') }
    }

    if (availability) {
      query.availability = { $in: [availability] }
    }

    // Build sort options
    const sortOptions: any = {}
    if (sort) {
      const [field, order] = sort.split(':')
      sortOptions[field] = order === 'desc' ? -1 : 1
    } else {
      // Default sort by rating
      sortOptions.rating = -1
    }

    const [doctors, totalDoctors] = await Promise.all([
      databaseService.doctors.find(query).sort(sortOptions).skip(skip).limit(limit).toArray(),
      databaseService.doctors.countDocuments(query)
    ])

    return {
      doctors,
      pagination: {
        page,
        limit,
        totalDoctors,
        totalPages: Math.ceil(totalDoctors / limit)
      }
    }
  }

  async getDoctorById(doctorId: string) {
    const doctor = await databaseService.doctors.findOne({ _id: new ObjectId(doctorId) })

    if (!doctor) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.DOCTOR_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return doctor
  }

  async getTopRatedDoctors(limit: number = 5) {
    const doctors = await databaseService.doctors.find().sort({ rating: -1 }).limit(limit).toArray()
    return doctors
  }

  async getDoctorSpecializations() {
    const specializations = await databaseService.doctors.distinct('specialization')
    return specializations
  }

  async getDoctorLocations() {
    const locations = await databaseService.doctors.distinct('location')
    return locations
  }

  async searchDoctorsBySymptom(symptom: string) {
    // This is a simplified implementation. In a real app, you might have a more sophisticated mapping
    // between symptoms and specializations
    const specializations = await this.mapSymptomToSpecializations(symptom)

    const doctors = await databaseService.doctors
      .find({ specialization: { $in: specializations } })
      .sort({ rating: -1 })
      .toArray()

    return doctors
  }

  private async mapSymptomToSpecializations(symptom: string): Promise<string[]> {
    // This is a simplified mapping. In a real app, you would have a more comprehensive mapping
    // possibly from a database or external service
    const symptomMap: Record<string, string[]> = {
      headache: ['Neurology', 'General Medicine'],
      'back pain': ['Orthopedics', 'Physical Therapy'],
      cough: ['Pulmonology', 'General Medicine'],
      fever: ['Infectious Disease', 'General Medicine'],
      'skin rash': ['Dermatology'],
      'stomach pain': ['Gastroenterology', 'General Medicine'],
      'sore throat': ['Otolaryngology', 'General Medicine'],
      anxiety: ['Psychiatry', 'Psychology'],
      depression: ['Psychiatry', 'Psychology'],
      'high blood pressure': ['Cardiology', 'Internal Medicine'],
      diabetes: ['Endocrinology', 'Internal Medicine']
    }

    const lowerSymptom = symptom.toLowerCase()

    // Check for exact matches
    if (symptomMap[lowerSymptom]) {
      return symptomMap[lowerSymptom]
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(symptomMap)) {
      if (key.includes(lowerSymptom) || lowerSymptom.includes(key)) {
        return value
      }
    }

    // Default to general medicine if no match found
    return ['General Medicine']
  }

  async getDoctorAvailability(doctorId: string, date: string) {
    const doctor = await this.getDoctorById(doctorId)

    // In a real app, this would query a more complex scheduling system
    // For now, we'll return a predefined list of times based on the doctor's availability
    // and filter out any times that are already booked

    // Get all booked appointments for this doctor on this date
    const bookedAppointments = await databaseService.appointments
      .find({
        doctor_id: new ObjectId(doctorId),
        date,
        status: { $nin: ['cancelled'] }
      })
      .toArray()

    // Extract the booked times
    const bookedTimes = bookedAppointments.map((appointment) => appointment.time)

    // Generate available times based on doctor's general availability
    // This is a simplified implementation
    const allPossibleTimes = [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00'
    ]

    // Filter out booked times
    const availableTimes = allPossibleTimes.filter((time) => !bookedTimes.includes(time))

    return {
      available_times: availableTimes
    }
  }

  async getDoctorReviews(doctorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [reviews, totalReviews] = await Promise.all([
      databaseService.reviews
        .find({ doctor_id: new ObjectId(doctorId) })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.reviews.countDocuments({ doctor_id: new ObjectId(doctorId) })
    ])

    // Get user names for the reviews
    const reviewsWithUserNames = await Promise.all(
      reviews.map(async (review) => {
        const user = await databaseService.users.findOne({ _id: review.user_id }, { projection: { name: 1 } })

        return {
          ...review,
          user_name: user?.name || 'Anonymous'
        }
      })
    )

    return {
      reviews: reviewsWithUserNames,
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit)
      }
    }
  }

  async submitDoctorReview(userId: string, doctorId: string, data: { rating: number; comment: string }) {
    // Validate doctor exists
    await this.getDoctorById(doctorId)

    // Check if user has already reviewed this doctor
    const existingReview = await databaseService.reviews.findOne({
      user_id: new ObjectId(userId),
      doctor_id: new ObjectId(doctorId)
    })

    if (existingReview) {
      // Update existing review
      await databaseService.reviews.updateOne(
        { _id: existingReview._id },
        {
          $set: {
            rating: data.rating,
            comment: data.comment
          },
          $currentDate: { updated_at: true }
        }
      )
    } else {
      // Create new review
      const review = new Review({
        user_id: new ObjectId(userId),
        doctor_id: new ObjectId(doctorId),
        rating: data.rating,
        comment: data.comment
      })

      await databaseService.reviews.insertOne(review)
    }

    // Update doctor's average rating
    await this.updateDoctorRating(doctorId)

    return {
      message: 'Review submitted successfully'
    }
  }

  private async updateDoctorRating(doctorId: string) {
    const reviews = await databaseService.reviews.find({ doctor_id: new ObjectId(doctorId) }).toArray()

    if (reviews.length === 0) {
      return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1))

    await databaseService.doctors.updateOne(
      { _id: new ObjectId(doctorId) },
      {
        $set: { rating: averageRating },
        $currentDate: { updated_at: true }
      }
    )
  }
}

const doctorService = new DoctorService()
export default doctorService
