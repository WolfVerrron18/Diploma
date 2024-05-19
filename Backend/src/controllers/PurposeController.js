/** @class PurposeService - Класс для работы с целями пользователя */
import PurposeService from '../services/PurposeService.js'

/** @module logger - Логирование приложения */
import logger from '../logger/logger.js'

/** @class PurposeController - Класс контроллера для работы с целями пользователя */
class PurposeController {
	/** @function
	 * @name get - Получение цели пользователя */
	async get(req, res) {
		try {
			const user = await PurposeService.purpose
				.get(req.params.id)
				.populate('purposeAccountId')
				.exec()

			res.status(200).json(user)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name create - Создание цели пользователя */
	async create(req, res) {
		try {
			const user = await PurposeService.purpose.create(req.body)

			res.status(200).json(user)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление цели пользователя */
	async remove(req, res) {
		try {
			await PurposeService.purpose.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new PurposeController()
