import mongoose from 'mongoose'

const TransactionScheme = new mongoose.Schema({
	name: { type: String, required: true },
	sum: { type: Number, required: true },
	type: { type: String },
	categoryId: { type: 'ObjectId', ref: 'Category', required: true },
	bankAccountId: { type: 'ObjectId', ref: 'BankAccount', required: true },
	date: { type: Date },
})

export default mongoose.model('Transaction', TransactionScheme)
