import { Router } from 'express'

import * as EditionController from '../controllers/editionsController.js'

export const editionsRouter = Router()

editionsRouter.get('/', EditionController.getEditions)
editionsRouter.post('/', EditionController.createEdition)
