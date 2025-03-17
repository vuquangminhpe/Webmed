import medicineApi from '@/apis/medicine.api'
import { Medicine } from '@/types/Medicine.type'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import path from '@/constants/path'

export const useMedicines = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery({
    queryKey: ['medicines', page, limit, search],
    queryFn: () => medicineApi.getMedicines(page, limit, search).then((res) => res.data.result),
    placeholderData: keepPreviousData
  })
}

export const useMedicine = (id: string) => {
  return useQuery({
    queryKey: ['medicine', id],
    queryFn: () => medicineApi.getMedicineById(id).then((res) => res.data.result),
    enabled: Boolean(id)
  })
}

export const useCreateOrder = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: {
      medicines: { medicine_id: string; quantity: number }[]
      shipping_address: string
      payment_method: 'cash' | 'card' | 'insurance'
    }) => medicineApi.createOrder(data),
    onSuccess: (data) => {
      toast.success('Order placed successfully!')
      navigate(`${path.paymentSuccess}?orderId=${data.data.result._id}`)
    }
  })
}

export const useUserOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: () => medicineApi.getUserOrders(page, limit).then((res) => res.data.result),
    placeholderData: keepPreviousData
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => medicineApi.getOrderById(id).then((res) => res.data.result),
    enabled: Boolean(id)
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => medicineApi.cancelOrder(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables] })
      toast.success('Order cancelled successfully!')
    }
  })
}

export const useCreateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Medicine, '_id' | 'created_at' | 'updated_at'>) => medicineApi.createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      toast.success('Medicine created successfully!')
    }
  })
}

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medicine> }) => medicineApi.updateMedicine(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['medicine', variables.id] })
      toast.success('Medicine updated successfully!')
    }
  })
}

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => medicineApi.deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      toast.success('Medicine deleted successfully!')
    }
  })
}
