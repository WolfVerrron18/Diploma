import BankAccountScheme from '../models/BankAccountModel.js'

class BankAccountService {
	get bankAccounts() {
		return {
			/** @function
			 * @name get - Получение банковского счёта */
			get: (id) => BankAccountScheme.findById(id),

			/** @function
			 * @name list - Получение списка банковских счетов */
			list: () => BankAccountScheme.find(),

			/** @function
			 * @name update - Обновление банковского счёта */
			update: (id, payload) => BankAccountScheme.findByIdAndUpdate(id, payload, { new: true }),

			/** @function
			 * @name create - Создание банковского счёта */
			create: (payload) => BankAccountScheme.create(payload),

			/** @function
			 * @name remove - Удаление банковского счёта */
			remove: (id) => BankAccountScheme.findByIdAndDelete(id),
		}
	}
}

export default new BankAccountService()
