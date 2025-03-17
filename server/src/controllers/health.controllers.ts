// server/src/controllers/health.controllers.ts
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import healthService from '../services/health.services'
import { SearchDiseaseReqBody } from '../models/request/Disease.request'
import { WEBMED_MESSAGES } from '../constant/messages'

export const getDiseasesController = async (req: Request, res: Response) => {
  const { page, limit, search } = req.query

  const result = await healthService.getDiseases(Number(page) || 1, Number(limit) || 10, (search as string) || '')

  return res.json({
    message: WEBMED_MESSAGES.DISEASE_LIST_SUCCESS,
    result
  })
}

export const getDiseaseByIdController = async (req: Request, res: Response) => {
  const { id } = req.params

  const disease = await healthService.getDiseaseById(id)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: disease
  })
}

export const createDiseaseController = async (req: Request, res: Response) => {
  const diseaseData = req.body

  const disease = await healthService.createDisease(diseaseData)

  return res.status(201).json({
    message: WEBMED_MESSAGES.DISEASE_CREATED,
    result: disease
  })
}

export const updateDiseaseController = async (req: Request, res: Response) => {
  const { id } = req.params
  const diseaseData = req.body

  const disease = await healthService.updateDisease(id, diseaseData)

  return res.json({
    message: WEBMED_MESSAGES.DISEASE_UPDATED,
    result: disease
  })
}

export const deleteDiseaseController = async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await healthService.deleteDisease(id)

  return res.json(result)
}

export const searchDiseasesBySymptoms = async (
  req: Request<ParamsDictionary, any, SearchDiseaseReqBody>,
  res: Response
) => {
  const { symptoms } = req.body

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      message: WEBMED_MESSAGES.INVALID_REQUEST
    })
  }

  const diseases = await healthService.searchDiseasesBySymptoms(symptoms)

  return res.json({
    message: WEBMED_MESSAGES.OPERATION_SUCCESS,
    result: diseases
  })
}
