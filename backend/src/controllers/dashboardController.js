import {
    getDashboardStats
} from '../services/dashboardService.js';


/**
 * Controller dashboard admin
 *
 * Endpoint:
 *
 * GET /api/admin/dashboard
 */
export const getDashboard = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil statistik dashboard
        // ========================================

        const stats = await getDashboardStats();


        // ========================================
        // 2. Response berhasil
        // ========================================

        return res.json({

            success: true,

            data: stats

        });


    } catch (error) {

        // ========================================
        // 3. Tangani error
        // ========================================

        console.error(error);

        return res.status(500).json({

            success: false,

            message: 'Failed to get dashboard statistics'

        });

    }

};