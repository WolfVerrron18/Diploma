import { Router } from 'express'
import ArtifactController from '../controllers/ArtifactController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const ArtifactRouter = new Router()

// Применяем middleware авторизации ко всем роутам артефактов
ArtifactRouter.use(AuthMiddleware)

/** Роуты для работы с артефактами */
ArtifactRouter.post('/artifacts', ArtifactController.create) // Кристаллизация
ArtifactRouter.get('/artifacts', ArtifactController.list) // Список
ArtifactRouter.get('/artifacts/:id', ArtifactController.get) // Детали
ArtifactRouter.put('/artifacts/:id', ArtifactController.update) // Редактирование
ArtifactRouter.delete('/artifacts/:id', ArtifactController.remove) // Удаление

export default ArtifactRouter
