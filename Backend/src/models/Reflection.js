import mongoose from 'mongoose'

const reflectionSchema = new mongoose.Schema(
	{
		// Привязка к пользователю
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true, // Индекс для быстрого поиска заметок конкретного юзера
		},

		// Заголовок мысли (на скриншоте: "dqwd dwd")
		title: {
			type: String,
			trim: true,
			maxlength: 200,
			default: '',
		},

		// Основной текст рефлексии
		content: {
			type: String,
			required: [true, 'Контент заметки не может быть пустым'],
			trim: true,
		},

		// Тип записи (выбор из Segmented Control: Идея, Заметка, Рефлексия)
		type: {
			type: String,
			enum: ['idea', 'memo', 'mind'],
			default: 'idea',
			lowercase: true,
		},

		// Важность/Интенсивность (звезды в интерфейсе 1-3)
		importance: {
			type: Number,
			min: 1,
			max: 3,
			default: 1,
		},

		// Метаданные для аналитики (опционально)
		moodScore: {
			type: Number, // Можно добавить скрытый расчет "настроения" текста в будущем
			min: 1,
			max: 5,
		},
	},
	{
		// Автоматически создает createdAt и updatedAt
		// На скриншоте мы видим "4 мая" — это будет браться из createdAt/updatedAt
		timestamps: true,
	},
)

// Виртуальное поле для красивого формата даты (если не хочешь форматировать на фронте)
reflectionSchema.virtual('formattedDate').get(function () {
	return this.updatedAt.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
	})
})

export default mongoose.model('Reflection', reflectionSchema)
