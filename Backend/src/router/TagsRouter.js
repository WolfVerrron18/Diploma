import { Router } from 'express'
import TagsController from '../controllers/TagsController.js'
const router = Router()

import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

router.use(AuthMiddleware)

// Категории
router.get('/categories', TagsController.categories.list)
router.get('/categories/:id', TagsController.categories.get)
router.post('/categories', TagsController.categories.create)
router.patch('/categories/:id', TagsController.categories.update)
router.delete('/categories/:id', TagsController.categories.remove)

// Теги
router.post('/tags', TagsController.tags.create)
router.patch('/tags/:id', TagsController.tags.update)
router.delete('/tags/:id', TagsController.tags.remove)

export default router
