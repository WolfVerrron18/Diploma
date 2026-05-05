/** @module TagService - Сервис управления справочником тегов и категорий */
import Category from '../models/tags/CategoryTags.js'
import Tag from '../models/tags/Tag.js'
import logger from '../logger/logger.js'

class TagService {
	/**
	 * @section Работа с категориями
	 */
	get categories() {
		return {
			/** Получение конкретной категории с тегами для текущего юзера */
			get: (id, userId) => {
				return Category.findOne({ _id: id, userId }).populate('tags')
			},

			/** Получение всех категорий со вложенными тегами (дерево) */
			list: (userId) => {
				// Предполагаем, что справочник может быть приватным для юзера
				return Category.find({ userId }).populate('tags').sort({ order: 1 })
			},

			/** Создание категории */
			create: (payload) => Category.create(payload),

			update: async (id, userId, updateData) => {
				const exists = await Category.findById(id)
				console.log('Категория вообще существует в БД?:', !!exists)
				console.log('Владелец категории в БД:', exists?.userId)
				console.log('Кто пытается обновить:', userId)

				return Category.findOneAndUpdate(
					{ _id: id, userId },
					{ $set: updateData },
					{ new: true, runValidators: true },
				)
			},

			/**
			 * Удаление категории.
			 * Благодаря pre-hook в схеме, которую мы написали ранее,
			 * вызов findOneAndDelete автоматически удалит и все связанные теги.
			 */
			remove: (id, userId) => {
				return Category.findOneAndDelete({ _id: id, userId })
			},
		}
	}

	/**
	 * @section Работа с конкретными тегами
	 */
	get tags() {
		return {
			/** @function
			 * @name get - Получение конкретного тега по ID */
			get: (id) => Tag.findById(id),

			/** Создание тега внутри категории */
			create: (categoryId, label) => {
				return Tag.create({ categoryId, label })
			},

			/** Переименование тега */
			update: (id, label) => {
				return Tag.findByIdAndUpdate(id, { $set: { label } }, { new: true })
			},

			/** Удаление одного конкретного тега */
			remove: (id) => Tag.findByIdAndDelete(id),

			/**
			 * Инкремент счетчика использования тега.
			 * Вызывается при создании Артефакта с этим тегом.
			 */
			incrementUsage: (id) => {
				return Tag.findByIdAndUpdate(id, { $inc: { usageCount: 1 } })
			},

			/** Декремент (при удалении артефакта или снятии тега) */
			decrementUsage: (id) => {
				return Tag.findByIdAndUpdate(id, { $inc: { usageCount: -1 } })
			},
		}
	}
}

export default new TagService()
