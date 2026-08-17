/**
 * Provider A
 *
 * Adapter untuk API provider asli.
 */
export const providerA = {

    async topup({
        product,
        player_id,
        server_id
    }) {

        console.log('=== PROVIDER A TOPUP START ===');

        console.log('Products:', product.name);
        console.log('SKU:', product.sku);
        console.log('Player ID:', player_id);
        console.log('Server ID:', server_id);

        console.log('=== BEFORE RETURN ===');


        return {
            success: true,
            transaction_id: 'PROVIDER-A-TEST',
            message: 'Provider A topup successful'
        };

    }

};