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

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({ email: req.body.email });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await user.comparePassword(req.body.password);

    console.log("PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.json({
      token: signToken(user),
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error(error);
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
