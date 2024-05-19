import BankAccountService from '../services/BankAccountService.js'
class BankAccountController {
	/** @function
	 * @name getPurpose - Получение цели пользователя */
	async getPurpose(req, res) {
		try {
			const purposeAccount = await BankAccountService.purpose.get(req.params.id)

			res.status(200).json(purposeAccount)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name create - Создание цели пользователя */
	async create(req, res) {
		try {
			const purposeAccount = await BankAccountService.purpose.create(req.body)

			res.status(200).json(purposeAccount)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление цели пользователя */
	async remove(req, res) {
		try {
			await BankAccountService.purpose.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new BankAccountController()
