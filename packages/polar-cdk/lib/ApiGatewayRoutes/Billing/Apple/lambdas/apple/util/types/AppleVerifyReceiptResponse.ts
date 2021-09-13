export interface AppleVerifyReceiptResponse {
    status?: number, // returned only on error
    environment: "Sandbox",
    receipt: {
        [key: string]: string | number | unknown[],
    },
    // eslint-disable-next-line camelcase
    latest_receipt_info: {
        // eslint-disable-next-line camelcase
        product_id: "plan_plus" | "plan_pro",
        // eslint-disable-next-line camelcase
        transaction_id: string,
        // eslint-disable-next-line camelcase
        original_transaction_id: string,
        // eslint-disable-next-line camelcase
        purchase_date_ms: string,
        // eslint-disable-next-line camelcase
        expire_date_ms: string,
        // eslint-disable-next-line camelcase
        in_app_ownership_type: "PURCHASED",

        /**
         * A unique identifier for purchase events across devices, including subscription-renewal events.
         * This value is the primary key to identify subscription purchases.
         */
        // eslint-disable-next-line camelcase
        web_order_line_item_id: string,
    }[],
}
