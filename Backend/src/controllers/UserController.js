/** @class UserService - Класс для работы с пользователями */
import UserService from '../services/UserService.js'

import AuthService from '../services/AuthService.js'

/** @module logger - Логирование приложения */
import logger from '../logger/logger.js'

/** @module bcrypt - Модуль шифрования */
import bcrypt from 'bcrypt'

import { Readable } from 'stream' // Встроенный модуль Node.js
import mongoose from 'mongoose'

/** @class UserController - Класс контроллера для работы с пользователями */
class UserController {
	/** @function
	 * @name get - Получение пользователя */
	async get(req, res) {
		try {
			const user = await UserService.users.get(req.params.id)

			res.status(200).json(user)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name getCurrentUser - Получение пользователя */
	getCurrentUser(req, res) {
		try {
			const user = global.currentUser

			if (!user) res.status(401).json({ error: 'Пользователь не аутентифицирован' })

			res.status(200).json(user)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

	/** @function
	 * @name create - Создание пользователя */
	async create(req, res) {
		try {
			const user = await UserService.users.create(req.body)

			res.status(200).json(user)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление пользователя */
	async remove(req, res) {
		try {
			await UserService.users.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	async update(req, res) {
		try {
			const payload = { ...req.body }

			if (req.file) {
				const db = mongoose.connection.db
				const bucket = new mongoose.mongo.GridFSBucket(db, {
					bucketName: 'avatars',
				})

				// Создаем уникальное имя файла
				const filename = `avatar-${Date.now()}-${req.file.originalname}`

				// Создаем поток для записи в GridFS
				const uploadStream = bucket.openUploadStream(filename, {
					contentType: req.file.mimetype,
				})

				// Превращаем буфер файла в читаемый поток и отправляем в базу
				const readableStream = new Readable()
				readableStream.push(req.file.buffer)
				readableStream.push(null) // Сигнал завершения потока

				await new Promise((resolve, reject) => {
					readableStream.pipe(uploadStream).on('error', reject).on('finish', resolve)
				})

				payload.avatar = filename // Сохраняем имя в профиль пользователя
			}

			const user = await UserService.users.update(req.params.id, payload)

			global.currentUser = user
			res.status(200).json(user)
		} catch (e) {
			console.error('Ошибка сохранения:', e)
			res.status(500).json({ message: 'Ошибка при сохранении файла' })
		}
	}
}

export default new UserController()
