import mongoose from 'mongoose'

const artifactSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		reflectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Reflection',
			required: [true, 'Артефакт должен иметь источник'],
			unique: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
		},

		content: {
			type: String,
			required: true,
			trim: true,
		},

		importance: {
			type: Number,
			min: 1,
			max: 3,
			default: 1,
		},

		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],

		/**
		 * НОВОЕ ПОЛЕ: Архивация
		 * true — если артефакт уже стал частью какой-то ретроспективы.
		 */
		isArchived: {
			type: Boolean,
			default: false,
			index: true, // Индекс важен, так как мы будем постоянно фильтровать по этому полю
		},
	},
	{
		timestamps: true,
		// Включаем виртуалы сразу в конфиге
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

/**
 * Middleware: Блокировка размышления
 */
artifactSchema.post('save', async function (doc, next) {
	try {
		const Reflection = mongoose.model('Reflection')
		await Reflection.findByIdAndUpdate(doc.reflectionId, {
			$set: { isDisabled: true },
		})
	} catch (err) {
		console.error('Ошибка при блокировке размышления:', err)
	}
	next()
})

/**
 * Виртуальные поля
 */
artifactSchema.virtual('formattedCreatedAt').get(function () {
	return this.createdAt
		? this.createdAt.toLocaleString('ru-RU', {
				day: '2-digit',
				month: 'long',
				hour: '2-digit',
				minute: '2-digit',
			})
		: ''
})

artifactSchema.virtual('tagsWithStyles').get(function () {
	if (!this.tags || this.tags.length === 0) return []

	return this.tags.map((tag) => {
		// Проверка на случай, если tag — это просто ObjectId (не был сделан populate)
		if (!tag.categoryId) {
			return typeof tag === 'object' ? tag.label || 'Тэг' : 'Тэг'
		}

		return {
			_id: tag._id,
			label: tag.label,
			color: tag.categoryId.color || '#909399',
			categoryName: tag.categoryId.name || 'Метка',
		}
	})
})

export default mongoose.model('Artifact', artifactSchema)
