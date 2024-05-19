/** @module PurposeScheme - Модель цели пользователя */
import PurposeScheme from '../models/PurposeModel.js'

/** @class PurposeService - Сервис для работы с целями пользователя */
class PurposeService {
	get purpose() {
		return {
			/** @function
			 * @name get - Получение цели пользователя */
			get: (id) => PurposeScheme.findById(id),

			/** @function
			 * @name get - Получение цели пользователя с фильтрацией по переданным параметрам*/
			findByParameter: (parameters) => PurposeScheme.findOne(parameters),

			/** @function
			 * @name create - Создание цели пользователя */
			create: (payload) => PurposeScheme.create(payload),

			/** @function
			 * @name remove - Удаление цели пользователя */
			remove: (id) => PurposeScheme.findByIdAndDelete(id),
		}
	}
}

export default new PurposeService()
