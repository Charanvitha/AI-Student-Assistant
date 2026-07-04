import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import studyRoutes from './routes/study.routes.js';
import careerRoutes from './routes/career.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import copilotRoutes from './routes/copilot.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import docs from '../docs/openapi.js';

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);   // <-- ADD THIS

  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));


  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'backend' }));
  app.get('/api/docs', (_req, res) => res.json(docs));

  app.use('/api/auth', authRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/study', studyRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/opportunities', opportunityRoutes);
  app.use('/api/copilot', copilotRoutes);
  app.use('/api/tasks', taskRoutes);

  app.use(errorHandler);
  return app;
}
