import Router from 'express'

/** @class CategoryController - Класс контроллера для работы с целями категориями */
import CategoryController from "../controllers/CategoryController.js";

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const CategoryRouter = new Router()

CategoryRouter.use(AuthMiddleware)

CategoryRouter.post('/categories', CategoryController.create)
CategoryRouter.get('/categories/:id', CategoryController.get)
CategoryRouter.get('/categories', CategoryController.list)
CategoryRouter.put('/categories/:id', CategoryController.update)
CategoryRouter.delete('/categories/:id', CategoryController.remove)

export default CategoryRouter