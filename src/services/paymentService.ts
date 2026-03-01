import api from "./api";

export const paymentService = {
    /**
     * Stripe — solicita al backend un PaymentIntent y devuelve el client_secret
     * para confirmar el pago desde el frontend con @stripe/stripe-js.
     */
    async createStripeIntent(amount: number, currency = "mxn") {
        const response = await api.post("/payments/stripe/create-intent/", {
            amount,
            currency,
        });
        return response.data; // { client_secret, publishable_key }
    },

    /**
     * Mercado Pago — solicita al backend una Preference y devuelve el
     * sandbox_init_point (test) e init_point (producción).
     */
    async createMPPreference(
        items: {
            product_id: number | string;
            name: string;
            quantity: number;
            unit_price: number;
        }[]
    ) {
        const response = await api.post(
            "/payments/mercadopago/create-preference/",
            { items }
        );
        return response.data; // { preference_id, init_point, sandbox_init_point }
    },
};
