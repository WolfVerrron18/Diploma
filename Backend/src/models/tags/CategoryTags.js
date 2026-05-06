import mongoose from 'mongoose'
import Tag from './Tag.js'

const CategorySchema = new mongoose.Schema(
	{
		// Добавляем привязку к пользователю
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true, // Индекс важен для быстрого поиска категорий конкретного юзера
		},
		name: { type: String, required: true, trim: true },
		color: { type: String, default: '#f59e0b' },
		description: { type: String, trim: true },
	},
	{
		timestamps: true,
	},
)

// Каскадное удаление тегов
CategorySchema.pre('findOneAndDelete', async function (next) {
	const categoryId = this.getQuery()._id
	try {
		await Tag.deleteMany({ categoryId })
		next()
	} catch (err) {
		next(err)
	}
})

// Определяем связь: у одной категории много тегов
CategorySchema.virtual('tags', {
	ref: 'Tag', // Модель тега
	localField: '_id', // ID категории
	foreignField: 'categoryId', // Поле в модели тега, где хранится ID категории
})

CategorySchema.virtual('tagsWithColor').get(function () {
	if (!this.tags) return []
	return this.tags.map((tag) => ({
		...tag.toObject(),
		color: this.color, // Примешиваем цвет категории прямо в объект тега
	}))
})

// Обязательно включаем виртуальные поля при конвертации в JSON
CategorySchema.set('toObject', { virtuals: true })
CategorySchema.set('toJSON', { virtuals: true })

export default mongoose.model('CategoryTags', CategorySchema)
