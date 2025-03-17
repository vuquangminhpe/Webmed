export interface SearchMedicineReqBody {
  keyword: string
  page?: number
  limit?: number
}

export interface OrderMedicineReqBody {
  medicines: {
    medicine_id: string
    quantity: number
  }[]
  shipping_address: string
  payment_method: 'cash' | 'card' | 'insurance'
}
