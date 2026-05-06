import mongoose from 'mongoose'

const artifactSchema = new mongoose.Schema(
	{
		// Привязка к пользователю (владелец артефакта)
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		// Ссылка на исходное размышление (источник кристаллизации)
		reflectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Reflection',
			required: [true, 'Артефакт должен иметь источник'],
			unique: true, // Один артефакт на одно размышление (чтобы не дублировать кристаллизацию)
		},

		// Заголовок артефакта (дистиллированное название)
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
		},

		// Итоговая мысль (суть опыта)
		content: {
			type: String,
			required: true,
			trim: true,
		},

		// Важность (звезды 1-3)
		importance: {
			type: Number,
			min: 1,
			max: 3,
			default: 1,
		},

		// Массив тегов (Смысловые связи)
		// Используем ObjectId, ссылаясь на твою схему Tag
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{
		timestamps: true,
	},
)

/**
 * Middleware (Pre-save hook)
 * Автоматическая блокировка исходного размышления после создания артефакта.
 * Важно: в модель Reflection нужно добавить поле isDisabled: { type: Boolean, default: false }
 */
artifactSchema.post('save', async function (doc, next) {
	try {
		await mongoose.model('Reflection').findByIdAndUpdate(doc.reflectionId, {
			$set: { isDisabled: true },
		})
		next()
	} catch (err) {
		next(err)
	}
})

// Виртуальное поле для фронта
artifactSchema.virtual('formattedCreatedAt').get(function () {
	return this.createdAt.toLocaleString('ru-RU', {
		day: '2-digit',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit',
	})
})

// Это виртуальное поле соберет данные из подгруженных тегов
artifactSchema.virtual('tagsWithStyles').get(function () {
	if (!this.tags || this.tags.length === 0) return []

	return this.tags.map((tag) => {
		// Проверяем, был ли сделан populate для тега и его категории
		const categoryColor = tag.categoryId?.color || '#909399'
		const categoryName = tag.categoryId?.name || 'Метка'

		return {
			_id: tag._id,
			label: tag.label,
			color: categoryColor,
			categoryName: categoryName,
		}
	})
})

// Не забываем включить виртуалы
artifactSchema.set('toObject', { virtuals: true })
artifactSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Artifact', artifactSchema)
