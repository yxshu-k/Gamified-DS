import express from 'express';
import { getLeaderboard, updateScore, updateMissionScore, getUserProgress } from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - anyone can view leaderboard
router.get('/', getLeaderboard);

// Protected routes - need authentication
router.post('/update-score', authenticate, updateScore);
router.post('/update-mission-score', authenticate, updateMissionScore);
router.get('/my-progress', authenticate, getUserProgress);

export default router;

