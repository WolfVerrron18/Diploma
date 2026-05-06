import { Router } from 'express'
import RetrospectiveController from '../controllers/RetrospectiveController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const RetrospectiveRouter = new Router()

/**
 * Применяем middleware авторизации ко всем роутам ретроспектив
 */
RetrospectiveRouter.use(AuthMiddleware)

/**
 * Роуты для работы с ретроспективами
 */

// 1. Получить список всех ретроспектив
RetrospectiveRouter.get('/retrospectives', RetrospectiveController.list)

// 2. Подготовить черновик по конкретной категории (возвращает артефакты)
RetrospectiveRouter.get('/retrospectives/prepare/:categoryId', RetrospectiveController.prepare)

// 3. Получить детали конкретной ретроспективы
RetrospectiveRouter.get('/retrospectives/:id', RetrospectiveController.get)

// 4. Сохранить готовую ретроспективу
RetrospectiveRouter.post('/retrospectives', RetrospectiveController.create)

// 5. Удалить ретроспективу
RetrospectiveRouter.delete('/retrospectives/:id', RetrospectiveController.remove)

export default RetrospectiveRouter
