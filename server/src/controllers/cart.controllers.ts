import { Request, Response } from 'express'
import { TokenPayload } from '~/models/request/User.request'
import cartService from '~/services/cart.services'

export const addToCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { medicine_id, quantity } = req.body

  const result = await cartService.addToCart(user_id, medicine_id, quantity || 1)

  return res.json({
    message: 'Item added to cart successfully',
    result
  })
}

export const getCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload

  const cart = await cartService.getCart(user_id)

  return res.json({
    message: 'Cart fetched successfully',
    result: cart
  })
}

export const updateCartItemController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { medicineId } = req.params
  const { quantity } = req.body

  const result = await cartService.updateCartItem(user_id, medicineId, quantity)

  return res.json({
    message: 'Cart item updated successfully',
    result
  })
}

export const removeFromCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { medicineId } = req.params

  const result = await cartService.removeFromCart(user_id, medicineId)

  return res.json({
    message: 'Item removed from cart successfully',
    result
  })
}

export const clearCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload

  const result = await cartService.clearCart(user_id)

  return res.json({
    message: 'Cart cleared successfully',
    result
  })
}
