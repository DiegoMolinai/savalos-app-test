import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // ← nuevo campo
  phone: { type: String },
  role: {
    type: String,
    enum: ['Admin', 'Técnico', 'Supervisor', 'Vendedor'],
    default: 'Técnico'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
