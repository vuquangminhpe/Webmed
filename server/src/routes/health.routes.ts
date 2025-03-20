import { Router } from 'express'
import {
  createDiseaseController,
  deleteDiseaseController,
  getDiseaseByIdController,
  getDiseasesController,
  searchDiseasesBySymptoms,
  updateDiseaseController
} from '~/controllers/health.controllers'
import { AccessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const healthRouter = Router()

healthRouter.get('/diseases', wrapAsync(getDiseasesController))
healthRouter.get('/diseases/:id', wrapAsync(getDiseaseByIdController))
healthRouter.post('/diseases/search', wrapAsync(searchDiseasesBySymptoms))

healthRouter.post('/diseases', AccessTokenValidator, wrapAsync(createDiseaseController))

healthRouter.put('/diseases/:id', AccessTokenValidator, wrapAsync(updateDiseaseController))

healthRouter.delete('/diseases/:id', AccessTokenValidator, wrapAsync(deleteDiseaseController))

export default healthRouter
