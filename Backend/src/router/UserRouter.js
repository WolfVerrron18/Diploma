import Router from 'express'
import UserController from '../controllers/UserController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import mongoose from 'mongoose'
import { upload } from '../middleware/Upload.js'

const UserRouter = new Router()

// Перенеси этот роут ВЫШЕ AuthMiddleware, чтобы картинки были доступны по ссылке
UserRouter.get('/users/avatar/:filename', async (req, res) => {
	try {
		const db = mongoose.connection.db
		const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'avatars' })
		const downloadStream = bucket.openDownloadStreamByName(req.params.filename)

		downloadStream.on('error', () => res.status(404).send('Not Found'))
		downloadStream.pipe(res)
	} catch (e) {
		res.status(500).send('Error')
	}
})

UserRouter.use(AuthMiddleware) // Всё что ниже — только для залогиненных

// Если AuthMiddleware стоит здесь, он применится ко ВСЕМ роутам ниже
UserRouter.use(AuthMiddleware)

UserRouter.post('/users', UserController.create)
UserRouter.get('/users/account/my', UserController.getCurrentUser) // Важно: этот роут должен быть ВЫШЕ, чем /:id
UserRouter.get('/users/:id', UserController.get)
UserRouter.delete('/users/:id', UserController.remove)

// Маршрут для загрузки аватара
UserRouter.patch('/users/:id/avatar', upload.single('avatar'), UserController.update)

// Если тебе нужно обычное обновление (текст), добавь и его:
UserRouter.patch('/users/:id', UserController.update)

export default UserRouter
