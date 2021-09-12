import findEmailFromTransactionId from "./util/findEmailFromTransactionId";
import changePlanForEmail from "./util/changePlanForEmail";
import {AppstoreNotificationRequest} from "./util/types/AppstoreNotificationRequest";
import downgradeToFree from "./util/downgradeToFree";

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
        case "DID_RENEW":
            // Activate user's purchased plan in Firestore

            const originalTransactionId = appleRequest.unified_receipt.latest_receipt_info.find(value => !!value.original_transaction_id)?.original_transaction_id

            if (!originalTransactionId) {
                const message = "Wanted to update user's plan but can not resolve original transaction ID";
                console.error(message)
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message,
                    }),
                }
            }

            const email = await findEmailFromTransactionId(originalTransactionId);

            if (!email) {
                console.error('Can not find email that corresponds to original transaction ID ' + originalTransactionId);
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

            // Find the first transaction that is still active (not expired)
            const activeReceipt = appleRequest.unified_receipt.latest_receipt_info.find(value => parseInt(value.expires_date_ms) > new Date().getTime());

            if (!activeReceipt) {
                console.log('User has no currently active subscriptions');

                if (!await downgradeToFree(email)) {
                    const error = `Failed to downgrade user to free plan: ${email}`;
                    console.error(error);
                    return {
                        statusCode: 500,
                        body: JSON.stringify({error}),
                    }
                }

                const message = `User ${email} downgraded to free plan`;
                console.log(message);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message,
                    })
                }
            }

            const productId = activeReceipt.product_id.replace('plan_', '') as "plus" | "pro";

            console.log('User bought product', productId);

            try {

                await changePlanForEmail({
                    email,
                    productId,
                    customerId: activeReceipt.original_transaction_id,
                    expiresAt: parseInt(activeReceipt.expires_date_ms) / 1000,
                });

            } catch(e) {

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
