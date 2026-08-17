import Order from "../models/Order.js";
import { createOrder, getAllOrders, getOrderById, payOrder, processOrder, getAllOrdersAdmin, getOrderByIdAdmin, updateOrderStatusData } from "../services/orderService.js";
import { processOrderData } from '../services/orderProcessingService.js';

/**
 * Membuat order baru
 */

export const create = async (req, res) => {

    try {
        
        // User ID diambil dari JWT
        //
        // Jangan mengambil user_id dari body
        // karena user bisa memalsukannya.

        const user_id = req.user.id;

        const {
            product_id,
            player_id,
            server_id
        } = req.body;


        // ========================================
        // Validasi input
        // ========================================


        if(!product_id || !player_id){
            return res.status(400).json({
                succes: false,
                message: 'Product ID and player ID are required'
            });
        }

        // ========================================
        // Buat order
        // ========================================

        const order = await createOrder({
             user_id,

            product_id,

            player_id,

            server_id
        });



        // ========================================
        // Response
        // ========================================

        res.status(201).json({
            succes: true,
            message: 'Order created successfully',
            data: order 
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            succes: false,
            message: error.message || 'Failed to create order'
        }); 
        
    }

}


/**
 * GET semua order milik user
 */

export const getOrders = async (req, res) => {

    try {
        
        // Ambil user ID dari JWT
        //
        // Bukan dari query/body.

        const user_id = req.user.id;

        const orders = await getAllOrders(user_id);

        return res.json({
            succes: true,
            data: orders
        })


    } catch (error) {
         console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get orders'
        });
    }

}


export const getOrder =  async(req, res) => {

    try {
        
        const {id} = req.params;

        // User ID berasal dari JWT
        const user_id = req.user.id;

        const order = await getOrderById(id, user_id)

        if(!order){

            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });

        }

        res.json({
            succes: true,
            data: order
        })

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get order'
        });
    }

}



/**
 * Membayar order
 */
export const pay = async (req, res) => {

    try {

        // Ambil ID order dari URL
        const { id } = req.params;


        // Ambil user dari JWT
        const user_id = req.user.id;


        // Proses pembayaran
        const order = await payOrder(
            id,
            user_id
        );


        return res.json({

            success: true,

            message: 'Payment successful',

            data: order

        });


    } catch (error) {

        console.error(error);


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


/**
 * Memproses order ke provider
 *
 * Endpoint ini digunakan untuk menjalankan
 * proses topup setelah pembayaran berhasil.
 */
export const process = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID order dari URL
        // ========================================
        //
        // Contoh:
        // POST /api/orders/1/process
        //
        // req.params.id = 1

        const { id } = req.params;


        // ========================================
        // 2. Proses order
        // ========================================
        //
        // Untuk processOrder kita tidak perlu
        // mengambil user_id dari JWT karena proses
        // ini nantinya merupakan proses internal
        // backend/provider.

        const result = await processOrder(id);


        // ========================================
        // 3. Response berhasil
        // ========================================

        return res.json({

            success: true,

            message: 'Order processed successfully',

            data: result

        });


    } catch (error) {

        // ========================================
        // 4. Tangani error
        // ========================================

        console.error(error);


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


/**
 * Mengambil seluruh order untuk admin
 */
/**
 * Mengambil seluruh order untuk admin
 *
 * Contoh:
 *
 * GET /api/orders/admin/all?page=1&limit=10
 *
 * Filter:
 *
 * GET /api/orders/admin/all?status=SUCCESS
 */
export const getOrdersAdmin = async (req, res) => {

    try {

        // ========================================
        // Ambil query parameter
        // ========================================

        let {
            page = 1,
            limit = 10,
            status,
            search
        } = req.query;


        // ========================================
        // Konversi pagination
        // ========================================

        page = parseInt(page);

        limit = parseInt(limit);


        // ========================================
        // Validasi page
        // ========================================

        if (page < 1) {

            page = 1;

        }


        // ========================================
        // Validasi limit
        // ========================================

        if (limit < 1) {

            limit = 10;

        }

        if (limit > 100) {

            limit = 100;

        }


        // ========================================
        // Panggil service
        // ========================================

        const result = await getAllOrdersAdmin({

            page,

            limit,

            status,

            search

        });


        // ========================================
        // Response
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

            message: 'Failed to get orders'

        });

    }

};


/**
 * Mengambil detail order untuk Admin
 *
 * GET /api/admin/orders/:id
 */
export const getOrderAdmin = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID order dari URL
        // ========================================

        const { id } = req.params;


        // ========================================
        // 2. Cari order
        // ========================================

        const order = await getOrderByIdAdmin(id);


        // ========================================
        // 3. Order tidak ditemukan
        // ========================================

        if (!order) {

            return res.status(404).json({

                success: false,

                message: 'Order not found'

            });

        }


        // ========================================
        // 4. Response
        // ========================================

        return res.json({

            success: true,

            data: order

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: 'Failed to get order'

        });

    }

};


/**
 * Mengubah status order oleh Admin
 *
 * PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatusAdmin = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID order dari URL
        // ========================================

        const { id } = req.params;


        // ========================================
        // 2. Ambil status dari request body
        // ========================================

        const { status } = req.body;


        // ========================================
        // 3. Validasi input
        // ========================================

        if (!status) {

            return res.status(400).json({

                success: false,

                message: 'Status is required'

            });

        }


        // ========================================
        // 4. Update status melalui service
        // ========================================

        const order = await updateOrderStatusData(
            id,
            status
        );


        // ========================================
        // 5. Response berhasil
        // ========================================

        return res.json({

            success: true,

            message: 'Order status updated successfully',

            data: order

        });


    } catch (error) {

        console.error(error);


        // ========================================
        // 6. Order tidak ditemukan
        // ========================================

        if (error.message === 'Order not found') {

            return res.status(404).json({

                success: false,

                message: error.message

            });

        }


        // ========================================
        // 7. Transition tidak valid
        // ========================================

        if (
            error.message.startsWith(
                'Cannot change order status'
            )
        ) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }


        // ========================================
        // 8. Error lainnya
        // ========================================

        return res.status(500).json({

            success: false,

            message: 'Failed to update order status'

        });

    }

};

/**
 * Memproses order
 *
 * POST /api/admin/orders/:id/process
 */
export const processOrderAdmin = async (req, res) => {

    try {

        // ========================================
        // 1. Ambil ID order
        // ========================================

        const { id } = req.params;


        // ========================================
        // 2. Proses order
        // ========================================

        const order = await processOrderData(id);


        // ========================================
        // 3. Response berhasil
        // ========================================

        return res.json({

            success: true,

            message: 'Order processing started',

            data: order

        });


    } catch (error) {

        console.error(error);


        // ========================================
        // Order tidak ditemukan
        // ========================================

        if (error.message === 'Order not found') {

            return res.status(404).json({

                success: false,

                message: error.message

            });

        }


        // ========================================
        // Status tidak sesuai
        // ========================================

        if (
            error.message.startsWith(
                'Order cannot be processed'
            )
        ) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }


        // ========================================
        // Error lainnya
        // ========================================

        return res.status(500).json({

            success: false,

            message: 'Failed to process order'

        });

    }

};