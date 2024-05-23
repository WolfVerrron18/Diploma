import Router from 'express'

/** @class BankAccountController - Класс контроллера для работы со счетами пользователя */
import BankAccountController from '../controllers/BankAccountController.js'

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const BankAccountRouter = new Router()

BankAccountRouter.use(AuthMiddleware)

BankAccountRouter.post('/bank-accounts', BankAccountController.create)
BankAccountRouter.get('/bank-accounts/:id', BankAccountController.get)
BankAccountRouter.get('/bank-accounts', BankAccountController.list)
BankAccountRouter.put('/bank-accounts/:id', BankAccountController.update)
BankAccountRouter.delete('/bank-accounts/:id', BankAccountController.remove)

export default BankAccountRouter
