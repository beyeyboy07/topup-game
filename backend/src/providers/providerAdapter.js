/**
 * Provider Adapter
 *
 * File ini menjadi interface standar untuk semua provider.
 *
 * Tujuannya:
 *
 * Order Service
 *      ↓
 * Provider Adapter
 *      ↓
 * Provider A / Provider B / Mock Provider
 *
 * Jadi Order Service tidak perlu mengetahui
 * detail API masing-masing provider.
 */

export const providerAdapter = {

    /**
     * Melakukan top-up
     *
     * @param {Object} data
     *
     * Data yang dikirim:
     * - product
     * - player_id
     * - server_id
     */
    async topup(data) {

        // Method ini sengaja belum memiliki
        // implementasi provider tertentu.
        //
        // Nanti method ini akan diarahkan
        // ke provider yang sesuai.

        throw new Error(
            'Provider topup is not implemented'
        );

    }

};