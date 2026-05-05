import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema(
	{
		label: { type: String, required: true, trim: true },
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
			index: true,
		},
		usageCount: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	},
)

// Уникальность названия внутри одной категории
TagSchema.index({ label: 1, categoryId: 1 }, { unique: true })

export default mongoose.model('Tag', TagSchema)
