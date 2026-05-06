/** @module ArtifactService - Сервис управления кристаллизованными артефактами */
import Artifact from '../models/Artifact.js'
import Reflection from '../models/Reflection.js'

class ArtifactService {
	/**
	 * Константа для глубокой подгрузки тегов, чтобы не дублировать код
	 */
	get #deepPopulateTags() {
		return {
			path: 'tags',
			populate: {
				path: 'categoryId',
				model: 'CategoryTags', // Имя модели из Category.js
			},
		}
	}

	get artifacts() {
		return {
			/** Получение конкретного артефакта */
			get: (id, userId) => {
				return Artifact.findOne({ _id: id, userId })
					.populate(this.#deepPopulateTags) // <-- Глубокая подгрузка
					.populate('reflectionId')
			},

			/** Список всех артефактов пользователя */
			list: (userId, query = {}) => {
				return Artifact.find({ userId, ...query })
					.populate(this.#deepPopulateTags) // <-- Глубокая подгрузка
					.sort({ createdAt: -1 })
			},

			/** Создание артефакта */
			create: async (userId, payload) => {
				const newArtifact = await Artifact.create({ ...payload, userId })

				// Чтобы после создания фронт сразу получил стили, делаем populate
				return Artifact.findById(newArtifact._id).populate(this.#deepPopulateTags)
			},

			/** Обновление данных артефакта */
			update: async (id, userId, updateData) => {
				return Artifact.findOneAndUpdate(
					{ _id: id, userId },
					{ $set: updateData },
					{ new: true, runValidators: true },
				).populate(this.#deepPopulateTags) // <-- Глубокая подгрузка
			},

			/** Удаление артефакта */
			remove: async (id, userId) => {
				const artifact = await Artifact.findOne({ _id: id, userId })
				if (!artifact) return null

				await Reflection.findOneAndUpdate(
					{ _id: artifact.reflectionId, userId },
					{ $set: { isDisabled: false } },
				)

				return Artifact.deleteOne({ _id: id })
			},
		}
	}
}

export default new ArtifactService()
