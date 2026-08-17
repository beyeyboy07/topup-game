import express from 'express';

import {
    getDashboard
} from '../controllers/dashboardController.js';

import {
    authenticate
} from '../middlewares/authMiddleware.js';

import {
    authorizeAdmin
} from '../middlewares/adminMiddleware.js';
import {
    getUsersAdmin, getUserAdmin, updateUserStatus
} from '../controllers/adminUserController.js';

import {
    getOrderAdmin, updateOrderStatusAdmin, processOrderAdmin
} from '../controllers/orderController.js';


const router = express.Router();

// ========================================
// ADMIN DASHBOARD
// ========================================
//
// GET /api/admin/dashboard
//
// Middleware:
//
// authenticate
//      ↓
// Memastikan JWT valid
//
// authorizeAdmin
//      ↓
// Memastikan role ADMIN
//
// getDashboard
//      ↓
// Mengambil statistik
//

router.get(
    '/dashboard',
    authenticate,
    authorizeAdmin,
    getDashboard
);

router.get(
    '/users',
    authenticate,
    authorizeAdmin,
    getUsersAdmin
);

router.get(
    '/users/:id',
    authenticate,
    authorizeAdmin,
    getUserAdmin
);

router.patch(
    '/users/:id/status',
    authenticate,
    authorizeAdmin,
    updateUserStatus
);

router.get(
    '/orders/:id',
    authenticate,
    authorizeAdmin,
    getOrderAdmin
);

router.patch(
    '/orders/:id/status',
    authenticate,
    authorizeAdmin,
    updateOrderStatusAdmin
);

router.post(
    '/orders/:id/process',
    authenticate,
    authorizeAdmin,
    processOrderAdmin
);

export default router;