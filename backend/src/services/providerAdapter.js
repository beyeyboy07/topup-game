import axios from 'axios';

export const sendTopup = async ({
    provider,
    product,
    player_id,
    server_id,
    order_number
}) => {

    // ========================================
    // Payload
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
    // Request ke provider
    // ========================================

    const response = await axios.post(
        `${provider.base_url}/topup`,
        payload,
        {
            headers: {
                'Authorization': `Bearer ${provider.api_key}`,
                'Content-Type': 'application/json'
            },

            timeout: 30000
        }
    );


    console.log('=== PROVIDER RAW RESPONSE ===');
    console.log(response.data);


    // ========================================
    // Normalisasi response
    // ========================================

    return {
        success: response.data.success,

        transaction_id:
            response.data.transaction_id,

        message:
            response.data.message
    };

};