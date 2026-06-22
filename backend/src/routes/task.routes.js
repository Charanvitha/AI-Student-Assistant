import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Task } from '../models/Task.js';
import { prioritizeTasks } from '../services/aiClient.js';

const router = Router();

const taskSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    deadline: z.string().datetime().or(z.string().min(8)),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional()
  })
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ deadline: 1 });
    const ai = await prioritizeTasks({ tasks });
    res.json({ tasks, ai });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, validate(taskSchema), async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) return next({ status: 404, message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return next({ status: 404, message: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
