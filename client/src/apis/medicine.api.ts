import { Medicine, MedicineOrder } from '@/types/Medicine.type'
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'

interface MedicineListResponse {
  medicines: Medicine[]
  pagination: {
    page: number
    limit: number
    totalMedicines: number
    totalPages: number
  }
}

interface OrderListResponse {
  orders: MedicineOrder[]
  pagination: {
    page: number
    limit: number
    totalOrders: number
    totalPages: number
  }
}

const medicineApi = {
  getMedicines: (page: number = 1, limit: number = 10, search: string = '') =>
    http.get<SuccessResponse<MedicineListResponse>>(`/medicine/medicines`, {
      params: {
        page,
        limit,
        search
      }
    }),

  getMedicineById: (id: string) => http.get<SuccessResponse<Medicine>>(`/medicine/medicines/${id}`),

  createOrder: (data: {
    medicines: { medicine_id: string; quantity: number }[]
    shipping_address: string
    payment_method: 'cash' | 'card' | 'insurance'
  }) => http.post<SuccessResponse<MedicineOrder>>('/medicine/orders', data),

  getUserOrders: (page: number = 1, limit: number = 10) =>
    http.get<SuccessResponse<OrderListResponse>>(`/medicine/orders`, {
      params: {
        page,
        limit
      }
    }),

  getOrderById: (id: string) => http.get<SuccessResponse<MedicineOrder>>(`/medicine/orders/${id}`),

  cancelOrder: (id: string) => http.post<SuccessResponse<{ message: string }>>(`/medicine/orders/${id}/cancel`),

  createMedicine: (data: Omit<Medicine, '_id' | 'created_at' | 'updated_at'>) =>
    http.post<SuccessResponse<Medicine>>('/medicine/medicines', data),

  updateMedicine: (id: string, data: Partial<Medicine>) =>
    http.put<SuccessResponse<Medicine>>(`/medicine/medicines/${id}`, data),

  deleteMedicine: (id: string) => http.delete<SuccessResponse<{ message: string }>>(`/medicine/medicines/${id}`)
}

export default medicineApi
