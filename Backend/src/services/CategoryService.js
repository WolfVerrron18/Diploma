/** @module CategoryScheme - Модель категори */
import CategoryScheme from '../models/CategoryModel.js'

/** @class CategoryService - Сервис для работы с категориями */
class CategoryService {
	get categories() {
		return {
			/** @function
			 * @name get - Получение категории */
			get: (id) => CategoryScheme.findById(id),

			/** @function
			 * @name list - Получение списка категорий */
			list: (id) => CategoryScheme.find({ user: id }),

			/** @function
			 * @name update - Обновление категории */
			update: (id, userId, updateData) => {
				return CategoryScheme.findOneAndUpdate(
					{ _id: id, user: userId }, // Ищем категорию по ID И владельцу
					{ $set: updateData },
					{ new: true }, // Чтобы вернулся уже обновленный объект
				)
			},

			/** @function
			 * @name create - Создание категории */
			create: (payload) => CategoryScheme.create(payload),

			/** @function
			 * @name remove - Удаление категории */
			remove: (id) => CategoryScheme.findByIdAndDelete(id),
		}
	}
}

export default new CategoryService()
