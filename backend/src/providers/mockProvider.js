/**
 * Mock Provider
 *
 * Provider palsu untuk testing.
 *
 * Belum melakukan request ke API luar.
 */
export const mockProvider = {

    /**
     * Simulasi proses top-up
     */
    async topup({
        product,
        player_id,
        server_id
    }) {

        // ========================================
        // 1. Tampilkan data yang dikirim
        // ========================================

        console.log(
            '=== MOCK PROVIDER TOPUP ==='
        );

        console.log(
            'Product:',
            product.name
        );

        console.log(
            'SKU:',
            product.sku
        );

        console.log(
            'Player ID:',
            player_id
        );

        console.log(
            'Server ID:',
            server_id
        );


        // ========================================
        // 2. Simulasi response provider
        // ========================================

        return {

            success: true,

            transaction_id:
                `MOCK-${Date.now()}`,

            message:
                'Mock topup successful'

        };

    }

};