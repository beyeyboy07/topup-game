export const sendTopup = async ({
    provider,
    product,
    player_id,
    server_id,
    order_number
}) => {

    // ========================================
    // PROVIDER REQUEST
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
    // MOCK PROVIDER
    // ========================================
    //
    // Sementara tidak melakukan HTTP request.
    //
    // Nanti ketika API provider asli sudah ada,
    // bagian ini diganti dengan axios.post().
    //

    const result = {

        success: true,

        transaction_id:
            `PROV-${Date.now()}`,

        message: 'Topup successful'

    };


    // ========================================
    // PROVIDER RESPONSE
    // ========================================

    console.log('=== PROVIDER RESPONSE ===');

    console.log(result);


    return result;

};