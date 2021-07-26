import findEmailFromTransactionId from "./util/findEmailFromTransactionId";
import changePlanForEmail from "./util/changePlanForEmail";
import {AppstoreNotificationRequest} from "./util/types/AppstoreNotificationRequest";

export const handler = async (event: {
    body: string,
}) => {

    const appleRequest: AppstoreNotificationRequest = JSON.parse(event.body);

    console.log(appleRequest);

    console.log('appleRequest.notification_type', appleRequest.notification_type);
    console.log('appleRequest.auto_renew_product_id', appleRequest.auto_renew_product_id);

    switch (appleRequest.notification_type) {
        case "INITIAL_BUY":
        case "INTERACTIVE_RENEWAL":
        case "DID_CHANGE_RENEWAL_STATUS":
            // Activate user's purchased plan in Firestore

            // Find the first transaction that is still active (not expired)
            const activeReceipt = appleRequest.unified_receipt.latest_receipt_info.find(value => parseInt(value.expires_date_ms) > new Date().getTime());

            if (!activeReceipt) {
                // User has no active current subscriptions
                console.log('User has no currently active subscriptions');
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: 'User has no currently active subscriptions',
                    })
                }

                // @TODO Downgrade in Firestore?
            }

            // @TODO Marks user as have purchased the plan
            const productId = activeReceipt.product_id.replace('plan_', '') as "plus" | "pro";

            console.log('User bought product', productId);
            console.log('activeReceipt.original_transaction_id', activeReceipt.original_transaction_id);

            const email = await findEmailFromTransactionId(activeReceipt.original_transaction_id);

            if (!email) {
                console.error('Can not find email that corresponds to original transaction ID ' + activeReceipt.original_transaction_id);
                return {
                    // Return a 200 even though this is an error, because this REST endpoint is called
                    // by Apple asynchronously as a webhook, so we don't want Apple to retry calling us
                    // thinking the server is having a temporary issue. We'll reach the same error anyway
                    statusCode: 200,
                    body: JSON.stringify({
                        result: 'Failed to find email for transaction ID',
                    })
                }
            }

            console.log('Found an email that corresponds to this transaction:', email);

            const changePlanSucceeded = await changePlanForEmail({
                email,
                productId,
                customerId: activeReceipt.original_transaction_id,
            });

            if (!changePlanSucceeded) {
                const error = "Failed to change user's plan due to an internal error";
                console.error(error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({error}),
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `User ${email} plan changed to ${productId}`,
                })
            }

        default:
            console.error('Case not implemented');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Case not implemented",
                })
            }
    }
}
