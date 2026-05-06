/** @module RetrospectiveService - Сервис управления тематическими ретроспективами */
import Retrospective from '../models/Retrospective.js'
import mongoose from 'mongoose'

class RetrospectiveService {
	/**
	 * Константа для имени модели категорий, чтобы не ошибиться
	 */
	#CATEGORY_MODEL = 'CategoryTags'

	/**
	 * Стандартный набор подгрузок для ретроспективы
	 */
	get #deepPopulate() {
		return [
			{
				path: 'categoryId',
				model: this.#CATEGORY_MODEL, // Явное указание модели
			},
			{
				path: 'artifacts',
				model: 'Artifact',
				populate: {
					path: 'tags',
					model: 'Tag',
					populate: {
						path: 'categoryId',
						model: this.#CATEGORY_MODEL, // Глубокое указание модели
					},
				},
			},
		]
	}

	get retrospectives() {
		// Сохраняем ссылку на сервис для доступа к #deepPopulate из вложенных методов
		const service = this

		return {
			/**
			 * Получение конкретной ретроспективы
			 */
			get: (id, userId) => {
				return Retrospective.findOne({ _id: id, userId }).populate(service.#deepPopulate)
			},

			/**
			 * Список всех ретроспектив пользователя
			 */
			list: (userId, categoryId = null) => {
				const query = { userId }
				if (categoryId) query.categoryId = categoryId

				return Retrospective.find(query)
					.populate({
						path: 'categoryId',
						model: service.#CATEGORY_MODEL, // Исправлено и здесь
					})
					.sort({ createdAt: -1 })
			},

			prepareDraft: async (userId, categoryId) => {
				try {
					const Tag = mongoose.model('Tag')
					const Artifact = mongoose.model('Artifact')

					// 1. Находим все теги, принадлежащие категории
					const tags = await Tag.find({ categoryId })
					const tagIds = tags.map((t) => t._id)

					if (!tagIds.length) {
						return {
							artifacts: [],
							suggestedTitle: `Ретроспектива: ${new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
						}
					}

					// 2. Ищем артефакты:
					// - принадлежат пользователю
					// - имеют нужные теги
					// - ВАЖНО: еще не заархивированы
					const artifacts = await Artifact.find({
						userId,
						tags: { $in: tagIds },
						isArchived: { $ne: true }, // Берем только "свежие" артефакты
					})
						.populate({
							path: 'tags',
							model: 'Tag',
							populate: {
								path: 'categoryId',
								model: service.#CATEGORY_MODEL,
							},
						})
						.sort({ importance: -1, createdAt: -1 })

					return {
						artifacts,
						suggestedTitle: `Ретроспектива: ${new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
					}
				} catch (error) {
					console.error('Error in prepareDraft:', error)
					throw error
				}
			},

			/**
			 * Создание ретроспективы с архивацией артефактов
			 */
			create: async (userId, payload) => {
				const Retrospective = mongoose.model('Retrospective')
				const Artifact = mongoose.model('Artifact')

				// 1. Создаем саму ретроспективу
				const newRetro = await Retrospective.create({
					...payload,
					userId,
				})

				// 2. АВТО-АРХИВАЦИЯ: помечаем выбранные артефакты как архивные
				if (payload.artifacts && payload.artifacts.length > 0) {
					await Artifact.updateMany(
						{ _id: { $in: payload.artifacts }, userId },
						{ $set: { isArchived: true } },
					)
				}

				return Retrospective.findById(newRetro._id).populate(service.#deepPopulate)
			},

			/**
			 * Удаление ретроспективы
			 */
			remove: (id, userId) => {
				return Retrospective.deleteOne({ _id: id, userId })
			},

			/**
			 * Аналитика: средний score по категориям
			 */
			getStats: async (userId) => {
				return Retrospective.aggregate([
					{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
					{
						$group: {
							_id: '$categoryId',
							avgScore: { $avg: '$score' },
							totalRetros: { $sum: 1 },
						},
					},
					{
						$lookup: {
							from: 'categorytags', // Имя коллекции в MongoDB (обычно маленькими буквами)
							localField: '_id',
							foreignField: '_id',
							as: 'category',
						},
					},
					{ $unwind: '$category' },
				])
			},
		}
	}
}

export default new RetrospectiveService()
