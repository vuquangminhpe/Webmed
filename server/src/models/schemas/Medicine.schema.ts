import { ObjectId } from 'mongodb'

interface MedicineType {
  _id?: ObjectId
  name: string
  description: string
  manufacturer: string
  price: number
  dosage: string
  side_effects: string[]
  requires_prescription: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Medicine {
  _id?: ObjectId
  name: string
  description: string
  manufacturer: string
  price: number
  dosage: string
  side_effects: string[]
  requires_prescription: boolean
  created_at: Date
  updated_at: Date

  constructor(medicine: MedicineType) {
    const date = new Date()
    this._id = medicine._id
    this.name = medicine.name
    this.description = medicine.description
    this.manufacturer = medicine.manufacturer
    this.price = medicine.price
    this.dosage = medicine.dosage
    this.side_effects = medicine.side_effects
    this.requires_prescription = medicine.requires_prescription
    this.created_at = medicine.created_at || date
    this.updated_at = medicine.updated_at || date
  }
}
