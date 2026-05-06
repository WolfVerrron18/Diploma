import mongoose from 'mongoose'

const reflectionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		title: {
			type: String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		content: {
			type: String,
			required: [true, 'Контент заметки не может быть пустым'],
			trim: true,
		},
		type: {
			type: String,
			enum: ['idea', 'memo', 'mind'],
			default: 'idea',
			lowercase: true,
		},
		importance: {
			type: Number,
			min: 1,
			max: 3,
			default: 1,
		},
		moodScore: {
			type: Number,
			min: 1,
			max: 5,
		},
		// Флаг мягкого удаления / скрытия записи
		isDisabled: {
			type: Boolean,
			default: false, // Теперь при создании всегда будет false, если не передано иное
		},
	},
	{
		timestamps: true,
	},
)

reflectionSchema.virtual('formattedDate').get(function () {
	return this.updatedAt.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
	})
})

// Настройка для того, чтобы виртуальные поля отображались при выводе в JSON
reflectionSchema.set('toJSON', { virtuals: true })
reflectionSchema.set('toObject', { virtuals: true })

export default mongoose.model('Reflection', reflectionSchema)
