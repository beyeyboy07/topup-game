/**
 * Memastikan user yang sedang login
 * memiliki role ADMIN.
 *
 * Middleware ini harus dijalankan
 * setelah authenticate().
 */
export const authorizeAdmin = (req, res, next) => {

    console.log('=== ADMIN MIDDLEWARE ===');


    // ========================================
    // 1. Pastikan user sudah ter-authenticate
    // ========================================

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

    }


    // ========================================
    // 2. Cek role user
    // ========================================

    if (req.user.role !== 'ADMIN') {

        return res.status(403).json({
            success: false,
            message: 'Forbidden'
        });

    }


    // ========================================
    // 3. User adalah ADMIN
    // ========================================

    next();
};