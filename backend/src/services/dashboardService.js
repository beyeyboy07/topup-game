import { Op } from 'sequelize';
import Order from '../models/Order.js';


/**
 * Mengambil statistik dashboard admin
 *
 * Statistik yang dihitung:
 *
 * ORDER:
 * - Total order
 * - Pending
 * - Paid
 * - Processing
 * - Success
 * - Failed
 *
 * SALES:
 * - Total sales
 * - Total cost / modal
 * - Total profit
 * - Sales hari ini
 * - Profit hari ini
 * - Sales bulan ini
 * - Profit bulan ini
 */
export const getDashboardStats = async () => {

    // ========================================
    // 1. Tentukan waktu sekarang
    // ========================================

    const now = new Date();


    // ========================================
    // 2. Tentukan awal hari ini
    // ========================================
    //
    // Contoh:
    //
    // 2026-08-17 00:00:00
    //
    // Semua transaksi setelah waktu ini
    // dianggap sebagai transaksi hari ini.

    const startOfToday = new Date(now);

    startOfToday.setHours(0, 0, 0, 0);


    // ========================================
    // 3. Tentukan awal bulan ini
    // ========================================
    //
    // Contoh:
    //
    // 2026-08-01 00:00:00

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );


    // ========================================
    // 4. Hitung total seluruh order
    // ========================================

    const totalOrders = await Order.count();


    // ========================================
    // 5. Hitung order PENDING
    // ========================================

    const pendingOrders = await Order.count({

        where: {
            status: 'PENDING'
        }

    });


    // ========================================
    // 6. Hitung order PAID
    // ========================================

    const paidOrders = await Order.count({

        where: {
            status: 'PAID'
        }

    });


    // ========================================
    // 7. Hitung order PROCESSING
    // ========================================

    const processingOrders = await Order.count({

        where: {
            status: 'PROCESSING'
        }

    });


    // ========================================
    // 8. Hitung order SUCCESS
    // ========================================

    const successOrders = await Order.count({

        where: {
            status: 'SUCCESS'
        }

    });


    // ========================================
    // 9. Hitung order FAILED
    // ========================================

    const failedOrders = await Order.count({

        where: {
            status: 'FAILED'
        }

    });


    // ========================================
    // 10. Hitung total sales
    // ========================================
    //
    // Sales hanya dihitung dari order SUCCESS.
    //
    // sell_price = harga yang dibayar customer.

    const totalSales = await Order.sum(
        'sell_price',
        {
            where: {
                status: 'SUCCESS'
            }
        }
    );


    // ========================================
    // 11. Hitung total cost / modal
    // ========================================
    //
    // buy_price = harga/modal dari provider.
    //
    // Hanya order SUCCESS yang dihitung.

    const totalCost = await Order.sum(
        'buy_price',
        {
            where: {
                status: 'SUCCESS'
            }
        }
    );


    // ========================================
    // 12. Hitung total profit
    // ========================================
    //
    // Rumus:
    //
    // Profit = Sales - Cost

    const totalProfit =
        (totalSales || 0) -
        (totalCost || 0);


    // ========================================
    // 13. Sales hari ini
    // ========================================
    //
    // Hanya order SUCCESS
    // yang dibuat mulai dari awal hari ini.

    const todaySales = await Order.sum(
        'sell_price',
        {
            where: {

                status: 'SUCCESS',

                created_at: {
                    [Op.gte]: startOfToday
                }

            }
        }
    );


    // ========================================
    // 14. Cost hari ini
    // ========================================

    const todayCost = await Order.sum(
        'buy_price',
        {
            where: {

                status: 'SUCCESS',

                created_at: {
                    [Op.gte]: startOfToday
                }

            }
        }
    );


    // ========================================
    // 15. Profit hari ini
    // ========================================
    //
    // Profit hari ini:
    //
    // Sales hari ini - Cost hari ini

    const todayProfit =
        (todaySales || 0) -
        (todayCost || 0);


    // ========================================
    // 16. Sales bulan ini
    // ========================================
    //
    // Hanya order SUCCESS
    // yang dibuat mulai awal bulan.

    const monthSales = await Order.sum(
        'sell_price',
        {
            where: {

                status: 'SUCCESS',

                created_at: {
                    [Op.gte]: startOfMonth
                }

            }
        }
    );


    // ========================================
    // 17. Cost bulan ini
    // ========================================

    const monthCost = await Order.sum(
        'buy_price',
        {
            where: {

                status: 'SUCCESS',

                created_at: {
                    [Op.gte]: startOfMonth
                }

            }
        }
    );


    // ========================================
    // 18. Profit bulan ini
    // ========================================

    const monthProfit =
        (monthSales || 0) -
        (monthCost || 0);


    // ========================================
    // 19. Return semua statistik
    // ========================================

    return {

        // ====================================
        // Statistik Order
        // ====================================

        orders: {

            // Jumlah semua order
            total: totalOrders,

            // Order yang belum dibayar
            pending: pendingOrders,

            // Order yang sudah dibayar
            paid: paidOrders,

            // Order yang sedang diproses
            processing: processingOrders,

            // Order berhasil
            success: successOrders,

            // Order gagal
            failed: failedOrders

        },


        // ====================================
        // Statistik Sales
        // ====================================

        sales: {

            // Total penjualan sepanjang waktu
            total: totalSales || 0,

            // Total modal sepanjang waktu
            cost: totalCost || 0,

            // Total keuntungan sepanjang waktu
            profit: totalProfit,

            // Penjualan hari ini
            today: todaySales || 0,

            // Keuntungan hari ini
            today_profit: todayProfit,

            // Penjualan bulan ini
            this_month: monthSales || 0,

            // Keuntungan bulan ini
            this_month_profit: monthProfit

        }

    };

};