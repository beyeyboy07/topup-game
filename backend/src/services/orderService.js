import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Game from '../models/Game.js';
import Provider from '../models/Provider.js';
import {
    updateOrderStatus
} from './orderStatusService.js';


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