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
			list: () => CategoryScheme.find(),

			/** @function
			 * @name update - Обновление категории */
			update: (id, payload) => CategoryScheme.findByIdAndUpdate(id, payload, { new: true }),

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
