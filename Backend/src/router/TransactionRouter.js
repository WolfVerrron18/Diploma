import Router from 'express'

/** @class TransactionController - Класс контроллера для работы с транзакциями */
import TransactionController from '../controllers/TransactionController.js'

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const TransactionRouter = new Router()

TransactionRouter.use(AuthMiddleware)

TransactionRouter.post('/transactions', TransactionController.create)
TransactionRouter.get('/transactions/:id', TransactionController.get)
TransactionRouter.get('/transactions', TransactionController.list)
TransactionRouter.put('/transactions/:id', TransactionController.update)
TransactionRouter.delete('/transactions/:id', TransactionController.remove)

export default TransactionRouter
