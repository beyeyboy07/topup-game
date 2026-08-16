import Order from '../models/Order.js';


/**
 * Mengubah status order
 *
 * Flow status:
 *
 * PENDING
 *    ↓
 * PAID
 *    ↓
 * PROCESSING
 *    ↓
 * SUCCESS / FAILED
 */
export const updateOrderStatus = async (id, status) => {

    // ========================================
    // 1. Cari order
    // ========================================

    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error('Order not found');
    }


    // ========================================
    // 2. Definisi status transition
    // ========================================

    const validTransitions = {

        // Order baru menunggu pembayaran
        PENDING: [
            'PAID'
        ],

        // Pembayaran sudah berhasil
        PAID: [
            'PROCESSING'
        ],

        // Sedang melakukan topup ke provider
        PROCESSING: [
            'SUCCESS',
            'FAILED'
        ],

        // Order berhasil
        SUCCESS: [],

        // Order gagal
        FAILED: []
    };


    // ========================================
    // 3. Ambil status sekarang
    // ========================================

    const currentStatus = order.status;


    // Status berikutnya yang diperbolehkan
    const allowedNextStatus =
        validTransitions[currentStatus];


    // ========================================
    // 4. Validasi transition
    // ========================================

    if (!allowedNextStatus.includes(status)) {

        throw new Error(
            `Cannot change order status from ${currentStatus} to ${status}`
        );

    }


    // ========================================
    // 5. Ubah status
    // ========================================

    order.status = status;


    // ========================================
    // 6. Simpan waktu berdasarkan status
    // ========================================

    if (status === 'PAID') {

        // Pembayaran berhasil
        order.paid_at = new Date();

    }


    if (status === 'SUCCESS') {

        // Topup berhasil
        order.completed_at = new Date();

    }


    // ========================================
    // 7. Simpan perubahan
    // ========================================

    await order.save();


    return order;
};