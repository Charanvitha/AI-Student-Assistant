import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

await connectDatabase();

createApp().listen(port, () => {
  console.log(`CampusCopilot API listening on port ${port}`);
});
