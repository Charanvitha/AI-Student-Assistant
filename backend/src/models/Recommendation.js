import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
