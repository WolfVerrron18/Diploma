import mongoose from 'mongoose'

const HistoryScheme = new mongoose.Schema({
	transactionId: { type: 'ObjectId', ref: 'Category', required: true },
})

export default mongoose.model('History', HistoryScheme)
