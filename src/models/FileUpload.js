import mongoose from 'mongoose';

const FileUploadSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  url: { type: String, required: true },
  uploadedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.FileUpload || mongoose.model('FileUpload', FileUploadSchema);
