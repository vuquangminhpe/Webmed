export interface Medicine {
  _id: string
  name: string
  description: string
  manufacturer: string
  price: number
  dosage: string
  side_effects: string[]
  requires_prescription: boolean
  created_at: string
  updated_at: string
}

export interface MedicineOrder {
  _id: string
  user_id: string
  medicines: {
    medicine_id: string
    quantity: number
    medicine_details?: Medicine
  }[]
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  payment_method: 'cash' | 'card' | 'insurance'
  created_at: string
  updated_at: string
}
