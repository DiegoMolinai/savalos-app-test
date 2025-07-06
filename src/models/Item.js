import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  // Campos simples
  title: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },

  // Objeto anidado
  category: {
    name: { type: String, default: "" },
    code: { type: String, default: "" }
  },

  // Arreglo de strings
  tags: {
    type: [String],
    default: []
  },

  // Arreglo de objetos
  specifications: {
    type: [{ key: String, value: String }],
    default: []
  },

  // Fecha de creación automática
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
