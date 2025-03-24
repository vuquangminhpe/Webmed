import { Router } from 'express'
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateCartItemController
} from '~/controllers/cart.controllers'
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
import { AccessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const medicineRouter = Router()

medicineRouter.get('/medicines', wrapAsync(getMedicinesController))
medicineRouter.get('/medicines/:id', wrapAsync(getMedicineByIdController))

medicineRouter.post('/orders', AccessTokenValidator, wrapAsync(orderMedicineController))

medicineRouter.get('/orders', AccessTokenValidator, wrapAsync(getUserOrdersController))

medicineRouter.get('/orders/:id', AccessTokenValidator, wrapAsync(getOrderByIdController))

medicineRouter.post('/orders/:id/cancel', AccessTokenValidator, wrapAsync(cancelOrderController))

medicineRouter.post('/medicines', AccessTokenValidator, wrapAsync(createMedicineController))

medicineRouter.put('/medicines/:id', AccessTokenValidator, wrapAsync(updateMedicineController))

medicineRouter.delete('/medicines/:id', AccessTokenValidator, wrapAsync(deleteMedicineController))
medicineRouter.post('/cart', AccessTokenValidator, wrapAsync(addToCartController))
medicineRouter.get('/cart', AccessTokenValidator, wrapAsync(getCartController))
medicineRouter.put('/cart/:medicineId', AccessTokenValidator, wrapAsync(updateCartItemController))
medicineRouter.delete('/cart/:medicineId', AccessTokenValidator, wrapAsync(removeFromCartController))
medicineRouter.delete('/cart', AccessTokenValidator, wrapAsync(clearCartController))
export default medicineRouter
