import Router from 'express'

/** @class PurposeController - Класс контроллера для работы с целями пользователя */
import PurposeController from '../controllers/PurposeController.js'

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const PurposeRouter = new Router()

PurposeRouter.use(AuthMiddleware)

PurposeRouter.post('/purposes', PurposeController.create)
PurposeRouter.get('/purposes/:id', PurposeController.get)
PurposeRouter.delete('/purposes/:id', PurposeController.remove)

export default PurposeRouter
