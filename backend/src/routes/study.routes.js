import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Recommendation } from '../models/Recommendation.js';
import { generateStudyPlan } from '../services/aiClient.js';

const router = Router();

router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const plan = await generateStudyPlan({
      subjects: req.body.subjects || [],
      hoursPerWeek: req.body.hoursPerWeek || 8,
      examDate: req.body.examDate,
      user: req.user
    });
    await Recommendation.create({ userId: req.user._id, type: 'study', content: plan });
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

export default router;
