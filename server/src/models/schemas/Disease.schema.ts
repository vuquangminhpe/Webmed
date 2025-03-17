import { ObjectId } from 'mongodb'

interface DiseaseType {
  _id?: ObjectId
  name: string
  symptoms: string[]
  description: string
  treatments: string[]
  prevention: string[]
  created_at?: Date
  updated_at?: Date
}

export default class Disease {
  _id?: ObjectId
  name: string
  symptoms: string[]
  description: string
  treatments: string[]
  prevention: string[]
  created_at: Date
  updated_at: Date

  constructor(disease: DiseaseType) {
    const date = new Date()
    this._id = disease._id
    this.name = disease.name
    this.symptoms = disease.symptoms
    this.description = disease.description
    this.treatments = disease.treatments
    this.prevention = disease.prevention
    this.created_at = disease.created_at || date
    this.updated_at = disease.updated_at || date
  }
}
