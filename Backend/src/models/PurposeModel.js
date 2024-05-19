import mongoose from 'mongoose'

import PurposeAccountModel from './PurposeAccountModel.js'

const PurposeScheme = new mongoose.Schema({
	name: { type: String, required: true },
	sum: { type: Number, required: true },
	description: { type: String },
	priorityId: { type: Number, required: true },
	purposeAccountId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: PurposeAccountModel,
		required: true,
	},
})

export default mongoose.model('Purpose', PurposeScheme)
