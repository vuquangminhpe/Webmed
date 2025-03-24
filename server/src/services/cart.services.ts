import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from './database.services'
import HTTP_STATUS from '~/constant/httpStatus'
import { WEBMED_MESSAGES } from '~/constant/messages'

// We'll need this schema for cart items
interface CartItem {
  _id?: ObjectId
  user_id: ObjectId
  medicine_id: ObjectId
  quantity: number
  created_at: Date
  updated_at: Date
}

class CartService {
  async addToCart(userId: string, medicineId: string, quantity: number = 1) {
    // First, validate that the medicine exists
    const medicine = await databaseService.medicines.findOne({ _id: new ObjectId(medicineId) })
    if (!medicine) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Check if prescription is required (optional validation)
    if (medicine.requires_prescription) {
      throw new ErrorWithStatus({
        message: 'This medicine requires a prescription',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Check if the item is already in the cart
    const existingCartItem = await databaseService.db.collection('cart_items').findOne({
      user_id: new ObjectId(userId),
      medicine_id: new ObjectId(medicineId)
    })

    if (existingCartItem) {
      // Update quantity if already in cart
      await databaseService.db.collection('cart_items').updateOne(
        { _id: existingCartItem._id },
        {
          $inc: { quantity: quantity },
          $currentDate: { updated_at: true }
        }
      )
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        user_id: new ObjectId(userId),
        medicine_id: new ObjectId(medicineId),
        quantity: quantity,
        created_at: new Date(),
        updated_at: new Date()
      }

      await databaseService.db.collection('cart_items').insertOne(cartItem)
    }

    return { message: 'Item added to cart successfully' }
  }

  async getCart(userId: string) {
    const cartItems = await databaseService.db
      .collection('cart_items')
      .find({
        user_id: new ObjectId(userId)
      })
      .toArray()

    let total = 0
    const items = await Promise.all(
      cartItems.map(async (item) => {
        const medicine = await databaseService.medicines.findOne({ _id: item.medicine_id })
        if (medicine) {
          total += medicine.price * item.quantity
        }
        return {
          medicine: medicine || { _id: item.medicine_id, name: 'Unknown medicine', price: 0 },
          quantity: item.quantity
        }
      })
    )

    return {
      items,
      total
    }
  }

  async updateCartItem(userId: string, medicineId: string, quantity: number) {
    if (quantity <= 0) {
      throw new ErrorWithStatus({
        message: 'Quantity must be at least 1',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await databaseService.db.collection('cart_items').updateOne(
      {
        user_id: new ObjectId(userId),
        medicine_id: new ObjectId(medicineId)
      },
      {
        $set: { quantity },
        $currentDate: { updated_at: true }
      }
    )

    if (result.matchedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Item not found in cart',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { message: 'Cart item updated successfully' }
  }

  async removeFromCart(userId: string, medicineId: string) {
    const result = await databaseService.db.collection('cart_items').deleteOne({
      user_id: new ObjectId(userId),
      medicine_id: new ObjectId(medicineId)
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Item not found in cart',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { message: 'Item removed from cart successfully' }
  }

  async clearCart(userId: string) {
    await databaseService.db.collection('cart_items').deleteMany({
      user_id: new ObjectId(userId)
    })

    return { message: 'Cart cleared successfully' }
  }
}

const cartService = new CartService()
export default cartService
