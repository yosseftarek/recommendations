import express from 'express';
import {
  getRecommendation,
  upsertRecommendation,
  getAvailableCombinations,
  seedAllRecommendations
} from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/seed-all', seedAllRecommendations);
router.get('/:skinType/:issue', getRecommendation);
router.post('/', upsertRecommendation);
router.get('/combinations', getAvailableCombinations);

export default router;