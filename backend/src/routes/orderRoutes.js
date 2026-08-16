import express from 'express';

import { create, getOrder, getOrders, pay } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========================================
// CREATE ORDER
// ========================================
//
// Hanya user yang sudah login
// yang bisa membuat order.
//
router.post(
    '/',
    authenticate,
    create
);

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);

router.post(
    '/:id/pay',
    authenticate,
    pay
);
export default router;