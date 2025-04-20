import { Router } from 'express'

import { EditionController } from '../controllers/editions.js'

export const editionsRouter = Router()

editionsRouter.get('/', EditionController.getAll)
editionsRouter.post('/', EditionController.create)
