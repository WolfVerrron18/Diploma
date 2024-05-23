import mongoose from 'mongoose'

const PurposeScheme = new mongoose.Schema({
	name: { type: String, required: true },
	sum: { type: Number, required: true },
	description: { type: String },
	priorityId: { type: Number, required: true },
})

export default mongoose.model('Purpose', PurposeScheme)
