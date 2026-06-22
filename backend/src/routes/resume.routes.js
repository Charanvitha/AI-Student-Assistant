import { Router } from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import { requireAuth } from '../middleware/auth.js';
import { Resume } from '../models/Resume.js';
import { analyzeResume } from '../services/aiClient.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  }
});

router.post('/upload', requireAuth, upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return next({ status: 400, message: 'PDF resume is required' });
    const parsed = await pdf(req.file.buffer);
    const resume = await Resume.create({
      userId: req.user._id,
      extractedText: parsed.text,
      fileName: req.file.originalname
    });
    res.status(201).json({ resumeId: resume._id, extractedText: parsed.text.slice(0, 2000) });
  } catch (error) {
    next(error);
  }
});

router.post('/analyze', requireAuth, async (req, res, next) => {
  try {
    const resume = req.body.resumeId
      ? await Resume.findOne({ _id: req.body.resumeId, userId: req.user._id })
      : await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!resume) return next({ status: 404, message: 'Resume not found' });

    const analysis = await analyzeResume({
      text: resume.extractedText,
      user: {
        skills: req.user.skills,
        interests: req.user.interests,
        careerGoal: req.user.careerGoal
      }
    });
    resume.analysis = analysis;
    await resume.save();
    res.json({ resumeId: resume._id, analysis });
  } catch (error) {
    next(error);
  }
});

export default router;
