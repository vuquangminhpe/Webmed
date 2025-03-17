import { ObjectId } from 'mongodb'

interface OrderType {
  _id?: ObjectId
  user_id: ObjectId
  medicines: {
    medicine_id: ObjectId
    quantity: number
  }[]
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  payment_method: 'cash' | 'card' | 'insurance'
  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id?: ObjectId
  user_id: ObjectId
  medicines: {
    medicine_id: ObjectId
    quantity: number
  }[]
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  payment_method: 'cash' | 'card' | 'insurance'
  created_at: Date
  updated_at: Date

  constructor(order: OrderType) {
    const date = new Date()
    this._id = order._id
    this.user_id = order.user_id
    this.medicines = order.medicines
    this.total_price = order.total_price
    this.status = order.status
    this.shipping_address = order.shipping_address
    this.payment_method = order.payment_method
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
