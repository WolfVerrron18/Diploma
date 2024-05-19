import mongoose from 'mongoose'

const CategoryScheme = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: Number },
    color: { type: String }
})

export default mongoose.model('Category', CategoryScheme)
