import express from 'express';

import {
    getGames,
    getGame,
    createGameData,
    updateGameData,
    deleteGameData
} from '../controllers/gameController.js';

import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getGames);

router.get('/:id', authenticate,getGame);

router.post('/', authenticate, authorize('ADMIN'), createGameData);

router.put('/:id', authenticate, authorize('ADMIN'),updateGameData);

router.delete('/:id', authenticate, authorize('ADMIN'), deleteGameData);

export default router;