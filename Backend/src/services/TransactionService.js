/** @module TransactionScheme - Модель транзакции */
import TransactionScheme from '../models/TransactionModel.js'

/** @class TransactionService - Сервис для работы с транзакциями */
class TransactionService {
	get transactions() {
		return {
			/** @function
			 * @name get - Получение транзакции */
			get: (id) => TransactionScheme.findById(id),

			/** @function
			 * @name list - Получение списка транзакций */
			list: (params) => TransactionScheme.find(params),

			/** @function
			 * @name update - Обновление транзакции */
			update: (id, payload) => TransactionScheme.findByIdAndUpdate(id, payload, { new: true }),

			/** @function
			 * @name create - Создание транзакции */
			create: (payload) => TransactionScheme.create(payload),

			/** @function
			 * @name remove - Удаление транзакции */
			remove: (id) => TransactionScheme.findOneAndDelete({ _id: id }),
		}
	}
}

export default new TransactionService()
