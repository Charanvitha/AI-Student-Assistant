import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Recommendation } from '../models/Recommendation.js';
import { generateRoadmap } from '../services/aiClient.js';

const router = Router();

router.post('/roadmap', requireAuth, async (req, res, next) => {
  try {
    const roadmap = await generateRoadmap({
      goal: req.body.goal || req.user.careerGoal,
      currentSkills: req.user.skills,
      interests: req.user.interests
    });
    await Recommendation.create({ userId: req.user._id, type: 'career', content: roadmap });
    res.json(roadmap);
  } catch (error) {
    next(error);
  }
});

export default router;
