// src/models/Material.js
import mongoose from 'mongoose'

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'unidad' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema)
