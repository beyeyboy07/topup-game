import Order from "../models/Order.js";
import { createOrder, getAllOrders, getOrderById, payOrder } from "../services/orderService.js";


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