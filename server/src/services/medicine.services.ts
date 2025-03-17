// server/src/services/medicine.services.ts
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import Medicine from '~/models/schemas/Medicine.schema'
import Order from '~/models/schemas/Order.schema'
import databaseService from './database.services'
import { OrderMedicineReqBody } from '~/models/request/Medicine.request'
import { WEBMED_MESSAGES } from '~/constant/messages'
import HTTP_STATUS from '~/constant/httpStatus'

class MedicineService {
  async getMedicines(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit
    const searchRegex = search ? new RegExp(search, 'i') : null

    const query = searchRegex ? { name: { $regex: searchRegex } } : {}

    const [medicines, totalMedicines] = await Promise.all([
      databaseService.medicines.find(query).skip(skip).limit(limit).sort({ name: 1 }).toArray(),
      databaseService.medicines.countDocuments(query)
    ])

    return {
      medicines,
      pagination: {
        page,
        limit,
        totalMedicines,
        totalPages: Math.ceil(totalMedicines / limit)
      }
    }
  }

  async getMedicineById(medicine_id: string) {
    const medicine = await databaseService.medicines.findOne({ _id: new ObjectId(medicine_id) })

    if (!medicine) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return medicine
  }

  async createMedicine(medicineData: Omit<Medicine, '_id' | 'created_at' | 'updated_at'>) {
    const medicine = new Medicine(medicineData)
    await databaseService.medicines.insertOne(medicine)
    return medicine
  }

  async updateMedicine(medicine_id: string, medicineData: Partial<Medicine>) {
    const existingMedicine = await databaseService.medicines.findOne({ _id: new ObjectId(medicine_id) })
    if (!existingMedicine) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const result = await databaseService.medicines.findOneAndUpdate(
      { _id: new ObjectId(medicine_id) },
      {
        $set: {
          ...medicineData
        },
        $currentDate: {
          updated_at: true
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async deleteMedicine(medicine_id: string) {
    const existingMedicine = await databaseService.medicines.findOne({ _id: new ObjectId(medicine_id) })
    if (!existingMedicine) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.medicines.deleteOne({ _id: new ObjectId(medicine_id) })
    return { message: WEBMED_MESSAGES.MEDICINE_DELETED }
  }

  async orderMedicine(userId: string, orderData: OrderMedicineReqBody) {
    let totalPrice = 0

    for (const item of orderData.medicines) {
      const medicine = await databaseService.medicines.findOne({ _id: new ObjectId(item.medicine_id) })

      if (!medicine) {
        throw new ErrorWithStatus({
          message: `Medicine with ID ${item.medicine_id} not found`,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      if (medicine.requires_prescription) {
        throw new ErrorWithStatus({
          message: `Medicine with ID ${item.medicine_id} requires prescription`,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      totalPrice += medicine.price * item.quantity
    }

    const order = new Order({
      user_id: new ObjectId(userId),
      medicines: orderData.medicines.map((item) => ({
        medicine_id: new ObjectId(item.medicine_id),
        quantity: item.quantity
      })),
      total_price: totalPrice,
      status: 'pending',
      shipping_address: orderData.shipping_address,
      payment_method: orderData.payment_method
    })

    await databaseService.orders.insertOne(order)

    return {
      order,
      message: WEBMED_MESSAGES.MEDICINE_ORDER_PLACED
    }
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [orders, totalOrders] = await Promise.all([
      databaseService.orders
        .find({ user_id: new ObjectId(userId) })
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .toArray(),
      databaseService.orders.countDocuments({ user_id: new ObjectId(userId) })
    ])

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const medicinesWithDetails = await Promise.all(
          order.medicines.map(async (item) => {
            const medicine = await databaseService.medicines.findOne({ _id: item.medicine_id })
            return {
              ...item,
              medicine_details: medicine
            }
          })
        )

        return {
          ...order,
          medicines: medicinesWithDetails
        }
      })
    )

    return {
      orders: ordersWithDetails,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit)
      }
    }
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(orderId),
      user_id: new ObjectId(userId)
    })

    if (!order) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const medicinesWithDetails = await Promise.all(
      order.medicines.map(async (item) => {
        const medicine = await databaseService.medicines.findOne({ _id: item.medicine_id })
        return {
          ...item,
          medicine_details: medicine
        }
      })
    )

    return {
      ...order,
      medicines: medicinesWithDetails
    }
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(orderId),
      user_id: new ObjectId(userId)
    })

    if (!order) {
      throw new ErrorWithStatus({
        message: WEBMED_MESSAGES.MEDICINE_ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status !== 'pending') {
      throw new ErrorWithStatus({
        message: 'Only pending orders can be cancelled',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.orders.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: 'cancelled'
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: WEBMED_MESSAGES.MEDICINE_ORDER_CANCELLED
    }
  }
}

const medicineService = new MedicineService()
export default medicineService
