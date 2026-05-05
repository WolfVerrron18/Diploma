/** @class ReflectionService - Класс для работы с размышлениями */
import ReflectionService from '../services/ReflectionService.js'

/** @class ReflectionController - Класс контроллера для работы с заметками (рефлексией) */
class ReflectionController {
	/** @function
	 * @name get - Получение конкретной заметки по ID */
	async get(req, res) {
		try {
			const reflection = await ReflectionService.reflections.get(req.params.id)

			if (!reflection) {
				return res.status(404).json({ message: 'Заметка не найдена' })
			}

			res.status(200).json(reflection)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении заметки' })
		}
	}

	/** @function
	 * @name list - Получение списка всех заметок пользователя */
	async list(req, res) {
		try {
			const userId = global?.currentUser?._id
			const reflections = await ReflectionService.reflections.list(userId)

			res.status(200).json(reflections)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка' })
		}
	}

	/** @function
	 * @name create - Создание новой мысли */
	async create(req, res) {
		console.log(req.body, global?.currentUser?._id)
		try {
			const reflection = await ReflectionService.reflections.create({
				...req.body,
				userId: global?.currentUser?._id, // Используем userId согласно нашей схеме Mongoose
			})

			res.status(200).json(reflection)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при создании', error: e.message })
		}
	}

	/** @function
	 * @name update - Обновление существующей заметки */
	async update(req, res) {
		try {
			const reflectionId = req.params.id
			const userId = global?.currentUser?._id

			const reflection = await ReflectionService.reflections.update(reflectionId, userId, req.body)

			if (!reflection) {
				return res.status(404).json({ message: 'Заметка не найдена или нет доступа' })
			}

			res.status(200).json(reflection)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при обновлении', error: e.message })
		}
	}

	/** @function
	 * @name remove - Удаление заметки */
	async remove(req, res) {
		try {
			const reflectionId = req.params.id
			const userId = global?.currentUser?._id

			const result = await ReflectionService.reflections.remove(reflectionId, userId)

			if (!result) {
				return res.status(404).json({ message: 'Запись не найдена для удаления' })
			}

			res.status(200).json({
				success: true,
				message: 'Мысль удалена',
				id: reflectionId,
			})
		} catch (e) {
			res.status(500).json({
				message: 'Ошибка при удалении',
				error: e.message,
			})
		}
	}
}

export default new ReflectionController()
