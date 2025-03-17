import { ObjectId } from 'mongodb'

interface InsuranceType {
  _id?: ObjectId
  name: string
  description: string
  coverage: string
  price: number
  duration: number
  created_at?: Date
  updated_at?: Date
}

export default class Insurance {
  _id?: ObjectId
  name: string
  description: string
  coverage: string
  price: number
  duration: number
  created_at: Date
  updated_at: Date

  constructor(insurance: InsuranceType) {
    const date = new Date()
    this._id = insurance._id
    this.name = insurance.name
    this.description = insurance.description
    this.coverage = insurance.coverage
    this.price = insurance.price
    this.duration = insurance.duration
    this.created_at = insurance.created_at || date
    this.updated_at = insurance.updated_at || date
  }
}
