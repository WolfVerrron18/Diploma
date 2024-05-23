import mongoose from 'mongoose'

const BankAccountScheme = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: Number, required: true },
	categoryId: { type: Number, required: true },
	value: { type: Number },
})

export default mongoose.model('BankAccount', BankAccountScheme)
