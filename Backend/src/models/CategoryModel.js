import mongoose from 'mongoose'

const CategoryScheme = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	type: { type: Number },
	color: { type: String },
	dateCreation: { type: Date },
	priority: { type: Number },
})

export default mongoose.model('Category', CategoryScheme)
