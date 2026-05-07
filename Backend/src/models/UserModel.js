import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserScheme = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	login: { type: String, required: true },
	password: { type: String, required: true },
	avatar: { type: String }, // Здесь будет храниться путь типа 'uploads/avatars/abc.jpg'
	isDarkMode: { type: Boolean, default: false },
	mood: {
		type: String,
		enum: ['default', 'calm', 'productive', 'stressed', 'tired'],
		default: 'default',
	},
})

UserScheme.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt()
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

export default mongoose.model('User', UserScheme)
