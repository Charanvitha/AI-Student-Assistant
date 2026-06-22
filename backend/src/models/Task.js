import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    reminderAt: Date
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
