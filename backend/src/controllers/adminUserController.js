import {
    getAllUsersAdmin, getUserByIdAdmin, updateUserStatusAdmin
} from '../services/userService.js';


/**
 * Mengambil daftar user untuk Admin
 *
 * GET /api/admin/users
 */
export const getUsersAdmin = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil query parameter
        // ========================================

        let {
            page = 1,
            limit = 10,
            search,
            status
        } = req.query;


        // ========================================
        // 2. Konversi pagination
        // ========================================

        page = parseInt(page);
        limit = parseInt(limit);


        // ========================================
        // 3. Validasi page
        // ========================================

        if (page < 1) {

            page = 1;

        }


        // ========================================
        // 4. Validasi limit
        // ========================================

        if (limit < 1) {

            limit = 10;

        }


        // Maksimal 100 data per request

        if (limit > 100) {

            limit = 100;

        }


        // ========================================
        // 5. Panggil service
        // ========================================

        const result = await getAllUsersAdmin({

            page,

            limit,

            search,

            status

        });


        // ========================================
        // 6. Response
        // ========================================

        return res.json({

            success: true,

            data: result.data,

            pagination: result.pagination

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: 'Failed to get users'

        });

    }

};


/**
 * Mengambil detail user untuk Admin
 *
 * GET /api/admin/users/:id
 */
export const getUserAdmin = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID dari URL
        // ========================================

        const { id } = req.params;


        // ========================================
        // 2. Cari user
        // ========================================

        const user = await getUserByIdAdmin(id);


        // ========================================
        // 3. User tidak ditemukan
        // ========================================

        if (!user) {

            return res.status(404).json({

                success: false,

                message: 'User not found'

            });

        }


        // ========================================
        // 4. Response
        // ========================================

        return res.json({

            success: true,

            data: user

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: 'Failed to get user'

        });

    }

};


/**
 * Mengubah status user oleh Admin
 *
 * PATCH /api/admin/users/:id/status
 */
export const updateUserStatus = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID user dari URL
        // ========================================

        const { id } = req.params;


        // ========================================
        // 2. Ambil status dari request body
        // ========================================

        const { status } = req.body;


        // ========================================
        // 3. Validasi status
        // ========================================

        if (status !== 0 && status !== 1) {

            return res.status(400).json({

                success: false,

                message: 'Status must be 0 or 1'

            });

        }


        // ========================================
        // 4. Update status
        // ========================================

        const user = await updateUserStatusAdmin(
            id,
            status
        );


        // ========================================
        // 5. User tidak ditemukan
        // ========================================

        if (!user) {

            return res.status(404).json({

                success: false,

                message: 'User not found'

            });

        }


        // ========================================
        // 6. Response berhasil
        // ========================================

        return res.json({

            success: true,

            message: 'User status updated successfully',

            data: user

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: 'Failed to update user status'

        });

    }

};