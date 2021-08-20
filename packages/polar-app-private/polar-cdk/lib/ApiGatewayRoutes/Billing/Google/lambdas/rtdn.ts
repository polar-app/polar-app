import {APIGatewayProxyHandler} from 'aws-lambda';
import changePlanForEmail from "../../Apple/lambdas/apple/util/changePlanForEmail";
import downgradeToFree from "../../Apple/lambdas/apple/util/downgradeToFree";
import {Firebase} from "polar-admin/Firebase";

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(event);
    const body: RTDNRequest = JSON.parse(event.body || "{}");

    if (!body.message.data) {
        // Payload didn't match the structure documented here:
        // @see https://developer.android.com/google/play/billing/rtdn-reference
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Invalid PubSub payload. Doesn't match documented structure",
            })
        }
    }

    const payload: DeveloperNotification = JSON.parse(Buffer.from(body.message.data, 'base64').toString());

    console.log('payload', payload);

    switch (payload.subscriptionNotification.notificationType) {
        case NOTIFICATION_TYPES.NOTIF_TYPE_SUBSCRIPTION_PURCHASED:
        case NOTIFICATION_TYPES.NOTIF_TYPE_SUBSCRIPTION_RENEWED:
        case NOTIFICATION_TYPES.NOTIF_TYPE_SUBSCRIPTION_RECOVERED:
        case NOTIFICATION_TYPES.NOTIF_TYPE_SUBSCRIPTION_RESTARTED:
            // Create firestore billing record
            await changePlanForEmail({
                email: await getEmailByPurchaseToken(payload.subscriptionNotification.purchaseToken),
                productId: convertAppStoreProductIdToPolarProduct(payload.subscriptionNotification.subscriptionId),
                customerId: payload.subscriptionNotification.purchaseToken,
                paymentMethod: "google_iap",
            })
            break;
        case NOTIFICATION_TYPES.NOTIF_TYPE_SUBSCRIPTION_EXPIRED:
            // Delete firestore billing record
            await downgradeToFree(await getEmailByPurchaseToken(payload.subscriptionNotification.purchaseToken)); // @TODO change email
            break;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello, Google",
        })
    }
}

interface RTDNRequest {
    message: {
        data: string,
        messageId: string,
        attributes: unknown,
    },
    subscription: string,
}

enum NOTIFICATION_TYPES {
    NOTIF_TYPE_SUBSCRIPTION_RECOVERED = 1,
    NOTIF_TYPE_SUBSCRIPTION_RENEWED = 2, // called on renewals
    NOTIF_TYPE_SUBSCRIPTION_CANCELED = 3, // called when subscription is cancelled from Google Play console by admin, probably also when user self-cancels subscription
    NOTIF_TYPE_SUBSCRIPTION_PURCHASED = 4, // called on first purchase
    NOTIF_TYPE_SUBSCRIPTION_ON_HOLD = 5,
    NOTIF_TYPE_SUBSCRIPTION_IN_GRACE_PERIOD = 6,
    NOTIF_TYPE_SUBSCRIPTION_RESTARTED = 7,
    NOTIF_TYPE_SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8,
    NOTIF_TYPE_SUBSCRIPTION_DEFERRED = 9,
    NOTIF_TYPE_SUBSCRIPTION_PAUSED = 10,
    NOTIF_TYPE_SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11,
    NOTIF_TYPE_SUBSCRIPTION_REVOKED = 12,
    NOTIF_TYPE_SUBSCRIPTION_EXPIRED = 13, // called when a subscription finally expires (no further renewals)
}

interface DeveloperNotification {
    version: string,
    packageName: string,
    eventTimeMillis: number,
    subscriptionNotification: {
        version: string, // Always "1.0"

        notificationType: NOTIFICATION_TYPES,

        // The token provided to the user's device when the subscription was purchased.
        purchaseToken: string,

        // The purchased subscription product ID
        subscriptionId: "subscription_plan_plus" | "subscription_plan_pro",
    }
}

async function getEmailByPurchaseToken(purchaseToken: string) {
    const ref = Firebase.getApp()
        .firestore()
        .collection('android_iap_receipt_to_email_map')
        .doc(purchaseToken);
    const res = await ref.get();
    return res.get('email');
}

function convertAppStoreProductIdToPolarProduct(subscriptionId: "subscription_plan_plus" | "subscription_plan_pro") {
    return subscriptionId.replace('subscription_plan_', '') as "plus" | "pro";
}
