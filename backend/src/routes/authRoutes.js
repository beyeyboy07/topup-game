import express from 'express';

import { register, login, getMe } from "../controllers/userController.js";

import { authenticate } from "../middlewares/authMiddleware.js";


const router = express.Router();


/**
 * Register user
 *
 * POST /api/auth/register
 */

router.post('/register', register)


// Login
// POST /api/auth/login
router.post('/login', login);

// User yang sudah login
router.get('/me', authenticate, getMe);

export default router