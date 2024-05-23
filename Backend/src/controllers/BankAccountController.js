import BankAccountService from '../services/BankAccountService.js'

class BankAccountController {
	/** @function
	 * @name get - Получение банковского счёта */
	async get(req, res) {
		try {
			const category = await BankAccountService.bankAccounts.get(req.params.id)

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name list - Получение списка банковских счётов */
	async list(req, res) {
		try {
			const categories = await BankAccountService.bankAccounts.list()

			res.status(200).json(categories)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name create - Создание банковского счёта */
	async create(req, res) {
		try {
			const category = await BankAccountService.bankAccounts.create(req.body)

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name update - Обновление банковского счёта */
	async update(req, res) {
		try {
			const category = await BankAccountService.bankAccounts.update(req.params.id, req.body)

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление банковского счёта */
	async remove(req, res) {
		try {
			await BankAccountService.bankAccounts.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new BankAccountController()
