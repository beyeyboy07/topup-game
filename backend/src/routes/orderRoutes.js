import express from 'express';

import { create, getOrder, getOrders, pay, process } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    authorizeAdmin
} from '../middlewares/adminMiddleware.js';

import {
    getOrdersAdmin
} from '../controllers/orderController.js';

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

// ========================================
// PROCESS ORDER
// ========================================
//
// Order harus sudah PAID.
//
// Contoh:
// POST /api/orders/1/process

router.post(
    '/:id/process',
    authenticate,
    process
);

router.get(
    '/admin/all',
    authenticate,
    authorizeAdmin,
    getOrdersAdmin
);


export default router;