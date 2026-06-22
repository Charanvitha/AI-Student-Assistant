import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { searchOpportunities } from '../services/aiClient.js';

const router = Router();

router.get('/search', requireAuth, async (req, res, next) => {
  try {
    const results = await searchOpportunities({
      query: req.query.q || 'student internships and hackathons',
      topK: Number(req.query.topK || 8),
      user: {
        skills: req.user.skills,
        interests: req.user.interests,
        careerGoal: req.user.careerGoal
      }
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
