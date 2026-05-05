/** @module ReflectionScheme - Модель размышления */
import Reflection from '../models/Reflection.js'

/** @class ReflectionService - Сервис для работы с размышлениями (заметками) */
class ReflectionService {
	get reflections() {
		return {
			/** @function
			 * @name get - Получение конкретной заметки по ID */
			get: (id) => Reflection.findById(id),

			/** @function
			 * @name list - Получение всех заметок конкретного пользователя */
			list: (userId) => Reflection.find({ userId: userId }).sort({ updatedAt: -1 }),

			/** @function
			 * @name update - Обновление заметки с проверкой владельца */
			update: (id, userId, updateData) => {
				return Reflection.findOneAndUpdate(
					{ _id: id, userId: userId }, // Безопасность: обновляем только если userId совпадает
					{ $set: updateData },
					{ new: true, runValidators: true }, // runValidators применит правила схемы при обновлении
				)
			},

			/** @function
			 * @name create - Создание новой заметки */
			create: (payload) => Reflection.create(payload),

			/** @function
			 * @name remove - Удаление заметки с проверкой владельца */
			remove: (id, userId) => {
				return Reflection.findOneAndDelete({ _id: id, userId: userId })
			},
		}
	}
}

export default new ReflectionService()
