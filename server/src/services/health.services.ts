// server/src/services/health.services.ts
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import Disease from '~/models/schemas/Disease.schema'
import databaseService from './database.services'
import { WEBMED_MESSAGES } from '~/constant/messages'
import HTTP_STATUS from '../constant/httpStatus'

class HealthService {
  async getDiseases(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit
    const searchRegex = search ? new RegExp(search, 'i') : null

    const query = searchRegex ? { name: { $regex: searchRegex } } : {}

    const [diseases, totalDiseases] = await Promise.all([
      databaseService.diseases.find(query).skip(skip).limit(limit).sort({ name: 1 }).toArray(),
      databaseService.diseases.countDocuments(query)
    ])

    return {
      diseases,
      pagination: {
        page,
        limit,
        totalDiseases,
        totalPages: Math.ceil(totalDiseases / limit)
      }
    }
  }

  async getDiseaseById(disease_id: string) {
    const disease = await databaseService.diseases.findOne({ _id: new ObjectId(disease_id) })

    if (!disease) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.DISEASE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return disease
  }

  async createDisease(diseaseData: Omit<Disease, '_id' | 'created_at' | 'updated_at'>) {
    const disease = new Disease(diseaseData)
    await databaseService.diseases.insertOne(disease)
    return disease
  }

  async updateDisease(disease_id: string, diseaseData: Partial<Disease>) {
    const existingDisease = await databaseService.diseases.findOne({ _id: new ObjectId(disease_id) })
    if (!existingDisease) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.DISEASE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const result = await databaseService.diseases.findOneAndUpdate(
      { _id: new ObjectId(disease_id) },
      {
        $set: {
          ...diseaseData
        },
        $currentDate: {
          updated_at: true
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async deleteDisease(disease_id: string) {
    const existingDisease = await databaseService.diseases.findOne({ _id: new ObjectId(disease_id) })
    if (!existingDisease) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.DISEASE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.diseases.deleteOne({ _id: new ObjectId(disease_id) })
    return { message: WEBMED_MESSAGES.DISEASE_DELETED }
  }

  async searchDiseasesBySymptoms(symptoms: string[]) {
    const diseases = await databaseService.diseases
      .find({ symptoms: { $in: symptoms } })
      .sort({ name: 1 })
      .toArray()

    return diseases
  }
}

const healthService = new HealthService()
export default healthService
