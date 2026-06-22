import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { signToken } from '../services/token.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    skills: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
    careerGoal: z.string().default('Full Stack Developer')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return next({ status: 409, message: 'Email already registered' });

    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return next({ status: 401, message: 'Invalid email or password' });
    }

    res.json({ token: signToken(user), user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
});

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    skills: user.skills,
    interests: user.interests,
    careerGoal: user.careerGoal
  };
}

export default router;
