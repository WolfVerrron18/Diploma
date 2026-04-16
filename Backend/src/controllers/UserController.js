/** @class UserService - Класс для работы с пользователями */
import UserService from '../services/UserService.js'

import AuthService from '../services/AuthService.js'

/** @module logger - Логирование приложения */
import logger from '../logger/logger.js'

/** @module bcrypt - Модуль шифрования */
import bcrypt from 'bcrypt'

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

	/** @function
	 * @name update - Обновление пользователя */
	async update(req, res) {
		try {
			const category = await UserService.users.update(req.params.id, req.body)

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new UserController()
