/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import medicineApi from '@/apis/medicine.api'

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => medicineApi.getCart().then((res) => res.data.result),
    // Don't refetch on window focus - only when explicitly invalidated
    refetchOnWindowFocus: false
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ medicineId, quantity }: { medicineId: string; quantity: number }) =>
      medicineApi.addToCart(medicineId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success(`Item added to cart`)
    },
    onError: () => {
      toast.error('Failed to add item to cart')
    }
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ medicineId, quantity }: { medicineId: string; quantity: number }) =>
      medicineApi.updateCartItem(medicineId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => {
      toast.error('Failed to update cart')
    }
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (medicineId: string) => medicineApi.removeFromCart(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Item removed from cart')
    },
    onError: () => {
      toast.error('Failed to remove item from cart')
    }
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => medicineApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Cart cleared')
    },
    onError: () => {
      toast.error('Failed to clear cart')
    }
  })
}
