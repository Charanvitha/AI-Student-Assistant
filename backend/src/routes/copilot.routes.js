import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';
import { chat, orchestrate } from '../services/aiClient.js';

const router = Router();

router.post('/chat', requireAuth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ deadline: 1 }).limit(10);
    const response = await chat({
      message: req.body.message,
      history: req.body.history || [],
      context: {
        user: req.user,
        tasks
      }
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/orchestrate', requireAuth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ deadline: 1 }).limit(20);
    res.json(await orchestrate({ user: req.user, tasks, intent: req.body.intent || 'daily brief' }));
  } catch (error) {
    next(error);
  }
});

export default router;
