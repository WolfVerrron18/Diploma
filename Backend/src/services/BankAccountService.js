import PurposeAccountModel from '../models/PurposeAccountModel.js'

class BankAccountService {
	get purpose() {
		return {
			/** @function
			 * @name get - Получение счёта привязанного к цели пользователя */
			get: (id) => PurposeAccountModel.findById(id),

			/** @function
			 * @name create - Создание счёта цели пользователя */
			create: (payload) => PurposeAccountModel.create(payload),

			/** @function
			 * @name remove - Удаление счёта цели пользователя */
			remove: (id) => PurposeAccountModel.findByIdAndDelete(id),
		}
	}
}

export default new BankAccountService()
