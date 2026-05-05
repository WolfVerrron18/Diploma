import mongoose from 'mongoose'

const CategoryScheme = new mongoose.Schema({
	name: { type: String, required: true },
	// Добавляем привязку к пользователю
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	description: { type: String },
	type: { type: Number },
	color: { type: String },
	dateCreation: { type: Date },
	priority: { type: Number },
})

export default mongoose.model('Categoryww', CategoryScheme)
