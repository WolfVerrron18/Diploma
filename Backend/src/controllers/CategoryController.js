/** @class CategoryService - Класс для работы с пользователями */
import CategoryService from '../services/CategoryService.js'

/** @class CategoryController - Класс контроллера для работы с категориями */
class CategoryController {
	/** @function
	 * @name get - Получение категории */
	async get(req, res) {
		try {
			const category = await CategoryService.categories.get(req.params.id)

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name list - Получение списка категорий */
	async list(req, res) {
		try {
			const categories = await CategoryService.categories.list(global?.currentUser?._id)

			res.status(200).json(categories)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка' })
		}
	}

	/** @function
	 * @name create - Создание категории */
	async create(req, res) {
		try {
			const category = await CategoryService.categories.create({
				...req.body,
				user: global?.currentUser?._id,
			})

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name update - Обновление категории */
	async update(req, res) {
		try {
			const categoryId = req.params.id
			const userId = global?.currentUser?._id

			// Передаем в сервис и ID категории, и ID пользователя для проверки владения
			const category = await CategoryService.categories.update(categoryId, userId, req.body)

			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена или нет доступа' })
			}

			res.status(200).json(category)
		} catch (e) {
			res.status(500).json(e)
		}
	}

	/** @function
	 * @name remove - Удаление категории */
	async remove(req, res) {
		try {
			await CategoryService.categories.remove(req.params.id)

			res.status(200)
		} catch (e) {
			res.status(500).json(e)
		}
	}
}

export default new CategoryController()
