import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  // Cliente visitado
  client: {
    // fullName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String },
  },

  // Dirección del domicilio
  address: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    commune: { type: String, required: true },
    region: { type: String, required: true },
    reference: { type: String, default: "" },
  },

  // Fecha programada
  scheduledDate: { type: Date, required: true },

  // Estado actual de la visita
  status: {
    type: String,
    enum: ["Pendiente", "Confirmada", "Reprogramada", "Cancelada", "Realizada"],
    default: "Pendiente",
  },

  // Técnico(s) asignado(s) a la visita
  assignedTo: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      role: String,
    },
  ],

  // Detalles adicionales
  notes: { type: String, default: "" },

  // Materiales usados en la instalación
  usedMaterials: [
    {
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      name: String, // snapshot
      quantity: Number,
    },
  ],
  executedAt: { type: Date },

  // Timestamp de creación
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);
