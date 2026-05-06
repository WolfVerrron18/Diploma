import mongoose from 'mongoose'

const retrospectiveSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		// Исправлено: используем 'CategoryTags', так как в проекте модель названа так
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CategoryTags',
			required: [true, 'Ретроспектива должна быть привязана к категории'],
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		artifacts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Artifact',
			},
		],

		finalInsight: {
			type: String,
			required: true,
			trim: true,
		},

		period: {
			start: Date,
			end: Date,
		},

		score: {
			type: Number,
			min: 0, // Изменил на 0, так как в хуке при отсутствии артефактов ставится 0
			max: 10,
		},
	},
	{
		timestamps: true,
		// Включаем виртуалы, если они понадобятся
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

retrospectiveSchema.index({ userId: 1, categoryId: 1 })

/**
 * Middleware: Автоматический расчет Score
 */
retrospectiveSchema.pre('save', async function (next) {
	// 1. Если артефакты не выбраны
	if (!this.artifacts || this.artifacts.length === 0) {
		this.score = 0
		return next()
	}

	try {
		// 2. Безопасное получение модели Artifact
		// Используем mongoose.model('Artifact'), чтобы не зависеть от порядка импортов в приложении
		const Artifact = mongoose.model('Artifact')

		const artifactsData = await Artifact.find(
			{
				_id: { $in: this.artifacts },
			},
			'importance',
		)

		if (!artifactsData.length) {
			this.score = 0
			return next()
		}

		// 3. Расчет среднего значения
		const totalImportance = artifactsData.reduce((sum, art) => sum + (art.importance || 0), 0)
		const average = totalImportance / artifactsData.length

		// 4. Масштабирование 1-3 в 1-10
		// (average * 3.33) дает 9.99 для 3 звезд, Math.round округлит до 10
		this.score = Math.round(average * 3.33)

		next()
	} catch (err) {
		// Если модель Artifact еще не зарегистрирована, Mongoose выбросит ошибку здесь
		console.error('Ошибка в хуке Retrospective:', err.message)
		next(err)
	}
})

// Экспортируем модель
export default mongoose.model('Retrospective', retrospectiveSchema)
