import mongoose from 'mongoose'

const PurposeAccountScheme = new mongoose.Schema({
	name: { type: String, required: true },
	sum: { type: mongoose.Decimal128 },
})

export default mongoose.model('PurposeAccount', PurposeAccountScheme)
