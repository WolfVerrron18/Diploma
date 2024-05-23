/** @class TransactionService - Класс для работы с транзакциями */
import TransactionService from '../services/TransactionService.js'

/** @class TransactionController - Класс контроллера для работы с транзакциями */
class TransactionController {
	/** @function
	 * @name get - Получение транзакции */
	async get(req, res) {
		try {
			const transaction = await TransactionService.transactions.get(req.params.id)

			res.status(200).json(transaction)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name list - Получение списка транзакций */
	async list(req, res) {
		try {
			const transactions = await TransactionService.transactions
				.list()
				.populate('categoryId')
				.exec()

			res.status(200).json(transactions)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name create - Создание транзакции */
	async create(req, res) {
		try {
			const transaction = await TransactionService.transactions.create(req.body)

			res.status(200).json(transaction)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name update - Обновление транзакции */
	async update(req, res) {
		try {
			const transaction = await TransactionService.transactions.update(req.params.id, req.body)

			res.status(200).json(transaction)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление транзакции */
	async remove(req, res) {
		try {
			await TransactionService.transactions.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new TransactionController()
