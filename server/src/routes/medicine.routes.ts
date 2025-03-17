import { Router } from 'express'
import {
  cancelOrderController,
  createMedicineController,
  deleteMedicineController,
  getMedicineByIdController,
  getMedicinesController,
  getOrderByIdController,
  getUserOrdersController,
  orderMedicineController,
  updateMedicineController
} from '~/controllers/medicine.controllers'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const medicineRouter = Router()

medicineRouter.get('/medicines', wrapAsync(getMedicinesController))
medicineRouter.get('/medicines/:id', wrapAsync(getMedicineByIdController))

medicineRouter.post('/orders', AccessTokenValidator, verifiedUserValidator, wrapAsync(orderMedicineController))

medicineRouter.get('/orders', AccessTokenValidator, verifiedUserValidator, wrapAsync(getUserOrdersController))

medicineRouter.get('/orders/:id', AccessTokenValidator, verifiedUserValidator, wrapAsync(getOrderByIdController))

medicineRouter.post('/orders/:id/cancel', AccessTokenValidator, verifiedUserValidator, wrapAsync(cancelOrderController))

medicineRouter.post('/medicines', AccessTokenValidator, verifiedUserValidator, wrapAsync(createMedicineController))

medicineRouter.put('/medicines/:id', AccessTokenValidator, verifiedUserValidator, wrapAsync(updateMedicineController))

medicineRouter.delete(
  '/medicines/:id',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(deleteMedicineController)
)

export default medicineRouter
