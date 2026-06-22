import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    extractedText: { type: String, required: true },
    fileName: { type: String, required: true },
    analysis: {
      score: Number,
      missingSkills: [String],
      strengths: [String],
      suggestions: [String],
      projects: [String]
    }
  },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', resumeSchema);
