import Router from 'express'

/** @class ReflectionController - Класс контроллера для работы с размышлениями */
import ReflectionController from '../controllers/ReflectionController.js'

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const ReflectionRouter = new Router()

// Все маршруты защищены авторизацией, так как размышления приватны
ReflectionRouter.use(AuthMiddleware)

/** Роуты для работы с заметками (рефлексией) */
ReflectionRouter.post('/reflections', ReflectionController.create)
ReflectionRouter.get('/reflections/:id', ReflectionController.get)
ReflectionRouter.get('/reflections', ReflectionController.list)
ReflectionRouter.put('/reflections/:id', ReflectionController.update)
ReflectionRouter.delete('/reflections/:id', ReflectionController.remove)

export default ReflectionRouter
