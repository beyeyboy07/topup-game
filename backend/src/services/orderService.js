import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Game from '../models/Game.js';
import Provider from '../models/Provider.js';
import User from '../models/User.js';
import {
    updateOrderStatus
} from './orderStatusService.js';

import { sendTopup } from "./providerAdapter.js";
import { Op } from 'sequelize';
/**
 * Membuat order baru
 *
 * Alur:
 * 1. Cari product
 * 2. Pastikan product aktif
 * 3. Ambil harga product
 * 4. Generate order number
 * 5. Simpan order
 */

export const createOrder = async (data) => {

    const {
        user_id,
        product_id,
        player_id,
        server_id
    } = data

    // ========================================
    // 1. Cari product
    // ========================================

    const product = await Product.findByPk(product_id);


    if (!product){
        throw new Error('Product not found');
    }


    // ========================================
    // 2. Pastikan product aktif
    // ========================================

    if(product.status != 1){
        throw new Error('Product is not active');
    }


    // ========================================
    // 3. Generate order number
    // ========================================

    // Contoh hasil:
    //
    // ORD-20260815-123456


    const now = new Date();

    // Membuat format tanggal: YYYYMMDD
    const date =
        now.getFullYear().toString() +              // Mengambil tahun, contoh: 2026
        String(now.getMonth() + 1).padStart(2, '0') + // Mengambil bulan (0-11), +1 agar menjadi 1-12
        String(now.getDate()).padStart(2, '0');     // Mengambil tanggal dan memastikan 2 digit

    // Membuat angka random 6 digit
    const random =
        Math.floor(100000 + Math.random() * 900000);
    // Hasil contoh: 483921

    // Membuat nomor order dengan format:
    // ORD-YYYYMMDD-RANDOM
    const orderNumber = `ORD-${date}-${random}`;

    // Contoh hasil:
    // ORD-20260816-483921

    // ========================================
    // 4. Buat order
    // ========================================

    const order = await Order.create({

        order_number: orderNumber,

        user_id: user_id,

        product_id: product.id,

        player_id: player_id,

        server_id: server_id,

        // Snapshot nama product
        product_name: product.name,

        // Snapshot harga saat order dibuat
        buy_price: product.buy_price,

        sell_price: product.sell_price,

        // Order baru selalu PENDING
        status: 'PENDING'

    });

    return order


}


export const getAllOrders = async (user_id) =>{

    const orders = await Order.findAll({


         // Hanya mengambil order milik user yang login
         where:{
            user_id: user_id
         },

         // Ambil informasi product
        include: [
            {
                model: Product,
                as: 'product',

                attributes: [
                    'id',
                    'name',
                    'sku'
                ],

                // Ambil informasi Game dari Product
                include: [
                    {
                        model: Game,
                        as: 'game',

                        attributes: [
                            'id',
                            'name',
                            'slug'
                        ]
                    },

                    // Ambil provider dari Product
                    {
                        model: Provider,
                        as: 'provider',

                        attributes: [
                            'id',
                            'name',
                            'code'
                        ]
                    }
                ]
            }
        ],

        // Order terbaru ditampilkan paling atas
        order: [
            ['id', 'DESC']
        ]

    });

    return orders;

}



/**
 * Mengambil detail order berdasarkan ID
 */

export const getOrderById = async (id, user_id) => {

    const order = await Order.findOne({

        // Cari berdasarkan:
        // 1. ID order
        // 2. ID user yang sedang login
        //
        // Jadi user tidak bisa melihat order milik user lain.

        where : {
            id: id,
            user_id: user_id
        },

        include: [
            {
                model: Product,
                as: 'product',

                attributes: [
                    'id',
                    'name',
                    'sku'
                ],

                include: [
                    {
                        model: Game,
                        as: 'game',

                        attributes: [
                            'id',
                            'name',
                            'slug'
                        ]
                    },

                    {
                        model: Provider,
                        as: 'provider',

                        attributes: [
                            'id',
                            'name',
                            'code'
                        ]
                    }
                ]
            }
        ]
    });

    return order;

}

/**
 * Simulasi pembayaran order
 *
 * Untuk sementara kita belum menggunakan
 * payment gateway asli.
 */
export const payOrder = async (id, user_id) => {

    // ========================================
    // 1. Cari order
    // ========================================

    const order = await Order.findOne({

        where: {
            id: id,

            // Pastikan order milik user
            user_id: user_id
        }

    });


    if (!order) {
        throw new Error('Order not found');
    }


    // ========================================
    // 2. Pastikan order masih PENDING
    // ========================================

    if (order.status !== 'PENDING') {

        throw new Error(
            `Order cannot be paid because current status is ${order.status}`
        );

    }


    // ========================================
    // 3. Simulasi pembayaran
    // ========================================

    // Untuk sekarang anggap pembayaran berhasil.
    //
    // Nanti bagian ini akan digantikan dengan
    // payment gateway asli.

    const paymentSuccess = true;


    if (!paymentSuccess) {

        throw new Error('Payment failed');

    }


    // ========================================
    // 4. Ubah status menjadi PAID
    // ========================================

    const paidOrder = await updateOrderStatus(
        order.id,
        'PAID'
    );


    return paidOrder;
};


/**
 * Memproses order ke provider
 */
export const processOrder = async (id) => {

    // ========================================
    // 1. Ambil order
    // ========================================

    const order = await Order.findOne({

        where: {
            id: id
        },

        include: [
            {
                model: Product,
                as: 'product',

                include: [
                    {
                        model: Provider,
                        as: 'provider'
                    }
                ]
            }
        ]
    });


    if (!order) {
        throw new Error('Order not found');
    }


    // ========================================
    // 2. Pastikan order sudah dibayar
    // ========================================

    if (order.status !== 'PAID') {

        throw new Error(
            `Order cannot be processed because current status is ${order.status}`
        );

    }


    // ========================================
    // 3. Ambil product
    // ========================================

    const product = order.product;

    if (!product) {
        throw new Error('Product not found');
    }


    // ========================================
    // 4. Ambil provider
    // ========================================

    const provider = product.provider;

    if (!provider) {
        throw new Error('Provider not found');
    }


    // ========================================
    // 5. Ubah status menjadi PROCESSING
    // ========================================

    await updateOrderStatus(
        order.id,
        'PROCESSING'
    );


    try {

        // ========================================
        // 6. Kirim transaksi ke provider
        // ========================================

        const result = await sendTopup({

            provider: provider,

            product: product,

            player_id: order.player_id,

            server_id: order.server_id,

            order_number: order.order_number

        });


        // ========================================
        // 7. Cek response provider
        // ========================================

        if (!result.success) {

            await updateOrderStatus(
                order.id,
                'FAILED'
            );

            throw new Error(
                result.message || 'Provider transaction failed'
            );
        }


        // ========================================
        // 8. Provider berhasil
        // ========================================

        const completedOrder =
            await updateOrderStatus(
                order.id,
                'SUCCESS'
            );


        return {

            order: completedOrder,

            provider_reference:
                result.provider_reference,

            message:
                result.message

        };


    } catch (error) {

        console.error(
            'Provider error:',
            error
        );


        // Kalau masih PROCESSING,
        // ubah menjadi FAILED.
        //
        // Jangan mencoba mengubah SUCCESS
        // menjadi FAILED.
        const currentOrder =
            await Order.findByPk(order.id);

        if (
            currentOrder &&
            currentOrder.status === 'PROCESSING'
        ) {

            await updateOrderStatus(
                order.id,
                'FAILED'
            );

        }


        throw error;
    }
};


/**
 * Mengambil seluruh order
 *
 * Berbeda dengan getAllOrders():
 * - getAllOrders() hanya mengambil order milik user
 * - getAllOrdersAdmin() mengambil semua order
 *
 * Function ini nantinya hanya boleh dipanggil
 * oleh user dengan role ADMIN.
 */
/**
 * Mengambil seluruh order untuk admin
 *
 * Fitur:
 * - Pagination
 * - Filter berdasarkan status
 * - Include user
 * - Include product
 * - Include game
 * - Include provider
 */
export const getAllOrdersAdmin = async ({
    page = 1,
    limit = 10,
    status,
    search
} = {}) => {

    // ========================================
    // Hitung offset pagination
    // ========================================

    const offset = (page - 1) * limit;


    // ========================================
    // Filter order
    // ========================================

    const where = {};


    // Filter berdasarkan status
    if (status) {

        where.status = status;

    }


    // ========================================
    // Search
    // ========================================
    //
    // Bisa mencari:
    // - order_number
    // - player_id
    //
    // Email user kita cari melalui
    // include User di bawah.

    if (search) {

        where[Op.or] = [

            {
                order_number: {
                    [Op.like]: `%${search}%`
                }
            },

            {
                player_id: {
                    [Op.like]: `%${search}%`
                }
            }

        ];

    }


    // ========================================
    // Query database
    // ========================================

    const result = await Order.findAndCountAll({

        where: where,

        include: [

            // ========================================
            // Product
            // ========================================

            {
                model: Product,
                as: 'product',

                attributes: [
                    'id',
                    'name',
                    'sku'
                ],

                include: [

                    {
                        model: Game,
                        as: 'game',

                        attributes: [
                            'id',
                            'name',
                            'slug'
                        ]
                    },

                    {
                        model: Provider,
                        as: 'provider',

                        attributes: [
                            'id',
                            'name',
                            'code'
                        ]
                    }

                ]
            },


            // ========================================
            // User
            // ========================================

            {
                model: User,
                as: 'user',

                attributes: [
                    'id',
                    'name',
                    'email'
                ],

                // Kalau search berupa email,
                // user juga ikut dicari.

                ...(search
                    ? {
                        where: {
                            email: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        required: false
                    }
                    : {}
                )
            }

        ],

        limit: limit,

        offset: offset,

        order: [
            ['id', 'DESC']
        ]

    });


    // ========================================
    // Hitung total halaman
    // ========================================

    const totalPages = Math.ceil(
        result.count / limit
    );


    return {

        data: result.rows,

        pagination: {

            page,

            limit,

            total: result.count,

            totalPages

        }

    };
};



/**
 * Mengambil detail order untuk Admin
 *
 * Admin bisa melihat:
 * - Informasi order
 * - User
 * - Product
 * - Game
 * - Provider
 */
export const getOrderByIdAdmin = async (id) => {

    // ========================================
    // 1. Cari order berdasarkan ID
    // ========================================

    const order = await Order.findByPk(id, {

        // ========================================
        // 2. Ambil relasi
        // ========================================

        include: [

            // ====================================
            // User pemilik order
            // ====================================

            {
                model: User,
                as: 'user',

                // Password JANGAN ikut diambil
                attributes: [
                    'id',
                    'name',
                    'email',
                    'role',
                    'status'
                ]
            },


            // ====================================
            // Product
            // ====================================

            {
                model: Product,
                as: 'product',

                attributes: [
                    'id',
                    'name',
                    'sku'
                ],

                // ==================================
                // Game dari Product
                // ==================================

                include: [

                    {
                        model: Game,
                        as: 'game',

                        attributes: [
                            'id',
                            'name',
                            'slug'
                        ]
                    },


                    // ==================================
                    // Provider dari Product
                    // ==================================

                    {
                        model: Provider,
                        as: 'provider',

                        attributes: [
                            'id',
                            'name',
                            'code'
                        ]
                    }

                ]
            }

        ]

    });


    // ========================================
    // 3. Order tidak ditemukan
    // ========================================

    if (!order) {

        return null;

    }


    // ========================================
    // 4. Return order
    // ========================================

    return order;

};


export const updateOrderStatusData = async (id, status) => {

    // ========================================
    // 1. Cari order berdasarkan ID
    // ========================================

    const order = await Order.findByPk(id);

    if (!order) {

        throw new Error('Order not found');

    }


    // ========================================
    // 2. Validasi status yang dikirim
    // ========================================

    const validStatuses = [
        'PENDING',
        'PAID',
        'PROCESSING',
        'SUCCESS',
        'FAILED'
    ];

    if (!validStatuses.includes(status)) {

        throw new Error('Invalid order status');

    }


    // ========================================
    // 3. Tentukan transition status
    // ========================================
    //
    // Status tidak boleh berubah sembarangan.
    //
    // PENDING
    //    ↓
    //   PAID
    //    ↓
    // PROCESSING
    //    ↓
    // SUCCESS / FAILED

    const validTransitions = {

        PENDING: [
            'PAID'
        ],

        PAID: [
            'PROCESSING'
        ],

        PROCESSING: [
            'SUCCESS',
            'FAILED'
        ],

        SUCCESS: [],

        FAILED: []

    };


    // ========================================
    // 4. Ambil status saat ini
    // ========================================

    const currentStatus = order.status;


    // ========================================
    // 5. Cari status berikutnya yang diizinkan
    // ========================================

    const allowedNextStatus =
        validTransitions[currentStatus];


    // ========================================
    // 6. Pastikan transition valid
    // ========================================

    if (!allowedNextStatus.includes(status)) {

        throw new Error(
            `Cannot change order status from ${currentStatus} to ${status}`
        );

    }


    // ========================================
    // 7. Update status
    // ========================================

    order.status = status;


    // ========================================
    // Jika order menjadi PAID
    // ========================================

    if (status === 'PAID') {

        order.paid_at = new Date();

    }


    // ========================================
    // Jika order selesai
    // ========================================

    if (
        status === 'SUCCESS' ||
        status === 'FAILED'
    ) {

        order.completed_at = new Date();

    }


    // ========================================
    // Simpan perubahan
    // ========================================

    await order.save();

    return order;

};