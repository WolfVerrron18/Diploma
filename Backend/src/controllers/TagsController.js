/** @module TagController - Контроллер для управления справочником тегов */
import TagsService from '../services/TagsService.js'

class TagController {
	/**
	 * @section Методы для Категорий
	 */
	get categories() {
		return {
			async get(req, res) {
				try {
					// Передаем и ID категории, и ID юзера для безопасности
					const category = await TagsService.categories.get(req.params.id, req.user.id)
					if (!category) return res.status(404).json({ message: 'Категория не найдена' })
					res.status(200).json(category)
				} catch (e) {
					res.status(500).json({ message: 'Ошибка при получении категории' })
				}
			},

			/** Получить весь справочник пользователя */
			list: async (req, res) => {
				try {
					const data = await TagsService.categories.list(req.user.id)
					res.json(data)
				} catch (error) {
					res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message })
				}
			},

			/** Получить только "активные" категории (где есть неархивные артефакты) */
			listActive: async (req, res) => {
				try {
					const data = await TagsService.categories.listActive(req.user.id)
					res.json(data)
				} catch (error) {
					res.status(500).json({
						message: 'Ошибка при получении активных категорий',
						error: error.message,
					})
				}
			},

			/** Создать новую категорию */
			create: async (req, res) => {
				try {
					const payload = { ...req.body, userId: req.user.id }
					const newCategory = await TagsService.categories.create(payload)
					res.status(201).json(newCategory)
				} catch (error) {
					res.status(400).json({ message: 'Ошибка при создании категории', error: error.message })
				}
			},

			/** Обновить категорию (имя, цвет, описание) */
			update: async (req, res) => {
				try {
					const updated = await TagsService.categories.update(
						req.params.id,
						req.user.id, // Исправлено: берем ID из проверенного middleware авторизации
						req.body,
					)

					if (!updated) return res.status(404).json({ message: 'Категория не найдена' })
					res.json(updated)
				} catch (error) {
					res.status(400).json({ message: 'Ошибка при обновлении категории', error: error.message })
				}
			},

			/** Удалить категорию (сработает каскадное удаление тегов) */
			remove: async (req, res) => {
				try {
					const { id } = req.params
					const deleted = await TagsService.categories.remove(id, req.user.id)
					if (!deleted) return res.status(404).json({ message: 'Категория не найдена' })
					res.json({ message: 'Категория и связанные теги удалены' })
				} catch (error) {
					res.status(500).json({ message: 'Ошибка при удалении категории', error: error.message })
				}
			},
		}
	}

	/**
	 * @section Методы для Тегов
	 */
	get tags() {
		return {
			/** Добавить тег в конкретную категорию */
			create: async (req, res) => {
				try {
					const { categoryId, label } = req.body
					// Здесь можно добавить проверку, принадлежит ли categoryId пользователю req.user.id
					const newTag = await TagsService.tags.create(categoryId, label)
					res.status(201).json(newTag)
				} catch (error) {
					res.status(400).json({ message: 'Ошибка при создании тега', error: error.message })
				}
			},

			/** Переименовать тег */
			update: async (req, res) => {
				try {
					const { id } = req.params
					const { label } = req.body
					const updated = await TagsService.tags.update(id, label)
					res.json(updated)
				} catch (error) {
					res.status(400).json({ message: 'Ошибка при обновлении тега', error: error.message })
				}
			},

			/** Удалить конкретный тег */
			remove: async (req, res) => {
				try {
					const { id } = req.params
					await TagsService.tags.remove(id)
					res.json({ message: 'Тег удален' })
				} catch (error) {
					res.status(500).json({ message: 'Ошибка при удалении тега', error: error.message })
				}
			},
		}
	}
}

export default new TagController()
