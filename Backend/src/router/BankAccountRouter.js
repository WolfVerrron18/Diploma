import Router from 'express'

/** @class BankAccountController - Класс контроллера для работы со счетами пользователя */
import BankAccountController from '../controllers/BankAccountController.js'

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const BankAccountRouter = new Router()

BankAccountRouter.use(AuthMiddleware)

BankAccountRouter.post('/bankAccounts/purposes', BankAccountController.create)
BankAccountRouter.get('/bankAccounts/purposes/:id', BankAccountController.getPurpose)
BankAccountRouter.delete('/bankAccounts/purposes/:id', BankAccountController.remove)

export default BankAccountRouter
