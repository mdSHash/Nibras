/**
 * Local stand-in for the Vercel serverless function, for testing the chat
 * feature against the real Vite dev server without needing a Vercel account
 * or `vercel dev`. Wraps the exact same api/chat.ts handler that gets
 * deployed to Vercel — nothing here is production code.
 *
 * Usage: npm run dev:chat-api   (reads GROQ_API_KEY/OPENROUTER_API_KEY from .env.local)
 * Then point the frontend at it: VITE_CHAT_API_URL=http://localhost:3002/api/chat
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../api/chat';
import feedbackHandler from '../api/feedback';

const PORT = Number(process.env.CHAT_DEV_PORT) || 3002;

const app = express();
app.use(express.json());

// Vercel routes every file in api/ on its own; mirror each one here.
app.all('/api/chat', (req, res) => {
  handler(req as unknown as VercelRequest, res as unknown as VercelResponse);
});
app.all('/api/feedback', (req, res) => {
  feedbackHandler(req as unknown as VercelRequest, res as unknown as VercelResponse);
});

app.listen(PORT, () => {
  console.log(`Local chat API dev server: http://localhost:${PORT}/api/chat`);
  if (!process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY) {
    console.warn('No GROQ_API_KEY or OPENROUTER_API_KEY found in .env.local — every request will fail over to "service busy".');
  }
});
