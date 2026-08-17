/**
 * Adapter untuk komunikasi dengan provider.
 *
 * Tujuan adapter:
 * - Menentukan format request ke provider
 * - Mengirim request
 * - Mengubah response provider menjadi
 *   format yang dipahami sistem kita
 *
 * Dengan cara ini orderService tidak perlu
 * mengetahui detail API setiap provider.
 */
export const sendTopup = async ({
    provider,
    product,
    player_id,
    server_id,
    order_number
}) => {

    // ========================================
    // Data yang akan dikirim ke provider
    // ========================================

    const payload = {

        sku: product.sku,

        player_id: player_id,

        server_id: server_id,

        reference: order_number

    };


    console.log('=== PROVIDER REQUEST ===');

    console.log('Provider:', provider.name);

    console.log('URL:', provider.base_url);

    console.log('Payload:', payload);


    // ========================================
    // SEMENTARA SIMULASI
    // ========================================

    return {
        success: true,

        transaction_id:
            `PROV-${Date.now()}`,

        message: 'Topup successful'
    };

};