import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { signToken } from '../services/token.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation Schemas
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

// =======================
// Register
// =======================
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const existing = await User.findOne({
      email: req.body.email
    });

    if (existing) {
      console.log("EMAIL EXISTS");
      return res.status(409).json({
        error: "Email already registered"
      });
    }

    const user = await User.create(req.body);

    console.log("USER CREATED:", user.email);

    const token = signToken(user);

    console.log("TOKEN CREATED");

    res.status(201).json({
      token,
      user: toSafeUser(user)
    });

  } catch (err) {
    console.error("REGISTER ERROR:");
    console.error(err);
    next(err);
  }
});

// =======================
// Login
// =======================
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const match = await user.comparePassword(req.body.password);

    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const token = signToken(user);

    console.log("LOGIN SUCCESS:", user.email);

    res.json({
      token,
      user: toSafeUser(user)
    });

  } catch (err) {
    console.error("LOGIN ERROR:");
    console.error(err);
    next(err);
  }
});

// =======================
// Helper
// =======================
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