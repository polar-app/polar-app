import {NOTIFICATION_TYPE} from "./NOTIFICATION_TYPE";

export interface AppstoreNotificationRequest {
    // eslint-disable-next-line camelcase
    notification_type: NOTIFICATION_TYPE,
    // eslint-disable-next-line camelcase
    unified_receipt: {
        // eslint-disable-next-line camelcase
        latest_receipt_info: {
            // The time when a subscription expires or when it will renew, in UNIX epoch time format, in milliseconds.
            // Use this time format for processing dates. For more information, see expires_date_ms.
            // eslint-disable-next-line camelcase
            expires_date_ms: string,

            // An indicator that the system canceled a subscription because the user upgraded.
            // This field is only present for upgrade transactions.
            // eslint-disable-next-line camelcase
            is_upgraded?: "true",

            // The time of the original app purchase, in UNIX epoch time format, in milliseconds.
            // Use this time format for processing dates. This value indicates the date of the
            // subscription’s initial purchase. The original purchase date applies to all product
            // types and remains the same in all transactions for the same product ID.
            // This value corresponds to the original transaction’s transactionDate property in StoreKit.
            // eslint-disable-next-line camelcase
            original_purchase_date_ms: string,

            // The transaction identifier of the original purchase
            // eslint-disable-next-line camelcase
            original_transaction_id: string,

            // The unique identifier of the product purchased. You provide this value when creating the product
            // in App Store Connect, and it corresponds to the productIdentifier property of the SKPayment object
            // stored in the transaction’s payment property.
            // eslint-disable-next-line camelcase
            product_id: "plan_plus" | "plan_pro",

            // The time when the App Store charged the user’s account for a subscription purchase
            // or renewal after a lapse, in the UNIX epoch time format, in milliseconds.
            // Use this time format for processing dates.
            // eslint-disable-next-line camelcase
            purchase_date_ms: string,

            // A unique identifier for purchase events across devices, including subscription-renewal events.
            // This value is the primary key to identify subscription purchases.
            // eslint-disable-next-line camelcase
            web_order_line_item_id: string,
        }[],
    },
    // eslint-disable-next-line camelcase
    auto_renew_product_id: "plan_plus" | "plan_pro",
}
