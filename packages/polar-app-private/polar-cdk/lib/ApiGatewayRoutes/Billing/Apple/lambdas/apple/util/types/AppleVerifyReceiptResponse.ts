export interface AppleVerifyReceiptResponse {
    status?: number, // returned only on error
    environment: "Sandbox",
    receipt: {
        [key: string]: string | number | unknown[],
    },
    latest_receipt_info: {
        product_id: "plan_plus" | "plan_pro",
        transaction_id: string,
        original_transaction_id: string,
        purchase_date_ms: string,
        expire_date_ms: string,
        in_app_ownership_type: "PURCHASED",

        /**
         * A unique identifier for purchase events across devices, including subscription-renewal events.
         * This value is the primary key to identify subscription purchases.
         */
        web_order_line_item_id: string,
    }[],
}
