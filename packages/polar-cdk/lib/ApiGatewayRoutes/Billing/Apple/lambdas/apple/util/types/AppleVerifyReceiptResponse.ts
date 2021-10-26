export interface AppleVerifyReceiptResponse {
    readonly status?: number, // returned only on error
    readonly environment: "Sandbox",
    readonly receipt: {
        readonly [key: string]: string | number | readonly unknown[],
    },
    // eslint-disable-next-line camelcase
    readonly latest_receipt_info: readonly {
        // eslint-disable-next-line camelcase
        readonly product_id: "plan_plus" | "plan_pro",
        // eslint-disable-next-line camelcase
        readonly transaction_id: string,
        // eslint-disable-next-line camelcase
        readonly original_transaction_id: string,
        // eslint-disable-next-line camelcase
        readonly purchase_date_ms: string,
        // eslint-disable-next-line camelcase
        readonly expire_date_ms: string,
        // eslint-disable-next-line camelcase
        readonly in_app_ownership_type: "PURCHASED",

        /**
         * A unique identifier for purchase events across devices, including subscription-renewal events.
         * This value is the primary key to identify subscription purchases.
         */
        // eslint-disable-next-line camelcase
        readonly web_order_line_item_id: string,
    }[],
}
