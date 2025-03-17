// server/src/controllers/medicine.controllers.ts
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import medicineService from '~/services/medicine.services'
import { OrderMedicineReqBody } from '~/models/request/Medicine.request'
import { TokenPayload } from '~/models/request/User.request'
import { WEBMED_MESSAGES } from '~/constant/messages'

export const getMedicinesController = async (req: Request, res: Response) => {
  const { page, limit, search } = req.query

  const result = await medicineService.getMedicines(Number(page) || 1, Number(limit) || 10, (search as string) || '')

  return res.json({
    message: WEBMED_MESSAGES.MEDICINE_LIST_SUCCESS,
    result
  })
}

export const getMedicineByIdController = async (req: Request, res: Response) => {
  const { id } = req.params

  const medicine = await medicineService.getMedicineById(id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: medicine
  })
}

export const createMedicineController = async (req: Request, res: Response) => {
  const medicineData = req.body

  const medicine = await medicineService.createMedicine(medicineData)

  return res.status(201).json({
    message: WEBMED_MESSAGES.MEDICINE_CREATED,
    result: medicine
  })
}

export const updateMedicineController = async (req: Request, res: Response) => {
  const { id } = req.params
  const medicineData = req.body

  const medicine = await medicineService.updateMedicine(id, medicineData)

  return res.json({
    message: WEBMED_MESSAGES.MEDICINE_UPDATED,
    result: medicine
  })
}

export const deleteMedicineController = async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await medicineService.deleteMedicine(id)

  return res.json(result)
}

export const orderMedicineController = async (
  req: Request<ParamsDictionary, any, OrderMedicineReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const orderData = req.body

  const result = await medicineService.orderMedicine(user_id, orderData)

  return res.status(201).json({
    message: WEBMED_MESSAGES.MEDICINE_ORDER_PLACED,
    result: result.order
  })
}

export const getUserOrdersController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { page, limit } = req.query

  const result = await medicineService.getUserOrders(user_id, Number(page) || 1, Number(limit) || 10)

  return res.json({
    message: WEBMED_MESSAGES.MEDICINE_ORDER_LIST_SUCCESS,
    result
  })
}

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params

  const order = await medicineService.getOrderById(id, user_id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: order
  })
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params

  const result = await medicineService.cancelOrder(id, user_id)

  return res.json(result)
}
