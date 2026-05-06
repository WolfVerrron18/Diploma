/** @module RetrospectiveController - Контроллер для управления ретроспективами */
import RetrospectiveService from '../services/RetrospectiveService.js'

class RetrospectiveController {
	/** Получение конкретной ретроспективы */
	async get(req, res) {
		try {
			const userId = global?.currentUser?._id
			const retro = await RetrospectiveService.retrospectives.get(req.params.id, userId)

			if (!retro) {
				return res.status(404).json({ message: 'Ретроспектива не найдена' })
			}

			res.status(200).json(retro)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении ретроспективы' })
		}
	}

	/** Список всех ретроспектив пользователя */
	async list(req, res) {
		try {
			const userId = global?.currentUser?._id
			const { categoryId } = req.query // Опциональная фильтрация по категории
			const retros = await RetrospectiveService.retrospectives.list(userId, categoryId)

			res.status(200).json(retros)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка ретроспектив' })
		}
	}

	/**
	 * Подготовка данных (черновика) для ретроспективы.
	 * Вызывается, когда пользователь выбрал категорию, но еще не нажал "Сохранить"
	 */
	async prepare(req, res) {
		try {
			const userId = global?.currentUser?._id
			const { categoryId } = req.params

			if (!categoryId) {
				return res.status(400).json({ message: 'Не указана категория для анализа' })
			}

			const draft = await RetrospectiveService.retrospectives.prepareDraft(userId, categoryId)
			res.status(200).json(draft)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при подготовке ретроспективы', error: e.message })
		}
	}

	/** Создание новой ретроспективы */
	async create(req, res) {
		try {
			const userId = global?.currentUser?._id
			const retro = await RetrospectiveService.retrospectives.create(userId, req.body)

			res.status(201).json(retro)
		} catch (e) {
			res.status(500).json({
				message: 'Ошибка при сохранении ретроспективы',
				error: e.message,
			})
		}
	}

	/** Удаление ретроспективы */
	async remove(req, res) {
		try {
			const userId = global?.currentUser?._id
			const retroId = req.params.id

			const result = await RetrospectiveService.retrospectives.remove(retroId, userId)

			if (!result.deletedCount) {
				return res.status(404).json({ message: 'Ретроспектива не найдена' })
			}

			res.status(200).json({
				success: true,
				message: 'Ретроспектива удалена',
				id: retroId,
			})
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при удалении', error: e.message })
		}
	}
}

export default new RetrospectiveController()
