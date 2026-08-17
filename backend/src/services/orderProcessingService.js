import Order from '../models/Order.js';
import Product from '../models/Product.js';
// import { mockProvider } from '../providers/mockProvider.js';
import Provider from '../models/Provider.js';
// import { getProvider } from '../providers/providerFactory.js';
import { sendTopup } from './providerAdapter.js';
/**
 * Memproses order
 *
 * Untuk sementara provider belum dipanggil.
 *
 * Flow:
 *
 * PAID
 *   ↓
 * PROCESSING
 *   ↓
 * proses top-up
 *   ↓
 * SUCCESS / FAILED
 */
export const processOrderData = async (id) => {

     // ========================================
    // 1. Cari order
    // ========================================

    const order = await Order.findByPk(id, {

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
    // 2. Pastikan order sudah PAID
    // ========================================

    if (order.status !== 'PAID') {

        throw new Error(
            `Order cannot be processed from status ${order.status}`
        );

    }


    // ========================================
    // 3. Ubah status menjadi PROCESSING
    // ========================================

    order.status = 'PROCESSING';

    await order.save();


    try {

        // ========================================
        // 4. Kirim order ke provider
        // ========================================

        const provider = order.product.provider;

        const result = await sendTopup({

            provider: provider,

            product: order.product,

            player_id: order.player_id,

            server_id: order.server_id,

            order_number: order.order_number

        });


        console.log('=== PROVIDER RESPONSE ===');
        console.log(result);
        // ========================================
        // 5. Periksa response provider
        // ========================================

        if (!result.success) {

            order.status = 'FAILED';

            order.completed_at = new Date();

            await order.save();

            return order;
        }


        // ========================================
        // Simpan transaction ID provider
        // ========================================

        order.provider_transaction_id =
            result.transaction_id;


        // ========================================
        // Tandai order SUCCESS
        // ========================================

        order.status = 'SUCCESS';


        // ========================================
        // Simpan waktu selesai
        // ========================================

        order.completed_at = new Date();


        await order.save();

        return order;


    } catch (error) {

        // ========================================
        // Provider mengalami error
        // ========================================

        order.status = 'FAILED';

        order.completed_at = new Date();

        await order.save();

        // Kirim error ke controller
        throw error;
    }

};