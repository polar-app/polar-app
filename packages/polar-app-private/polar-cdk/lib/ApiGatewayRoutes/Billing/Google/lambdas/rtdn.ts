import {APIGatewayProxyHandler} from 'aws-lambda';

interface RTDNRequest {
    message: {
        data: string,
        messageId: string,
        attributes: unknown,
    },
    subscription: string,
}

type NOTIF_TYPE_SUBSCRIPTION_RECOVERED = 1;
type NOTIF_TYPE_SUBSCRIPTION_RENEWED = 2;
type NOTIF_TYPE_SUBSCRIPTION_CANCELED = 3;
type NOTIF_TYPE_SUBSCRIPTION_PURCHASED = 4;
type NOTIF_TYPE_SUBSCRIPTION_ON_HOLD = 5;
type NOTIF_TYPE_SUBSCRIPTION_IN_GRACE_PERIOD = 6;
type NOTIF_TYPE_SUBSCRIPTION_RESTARTED = 7;
type NOTIF_TYPE_SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8;
type NOTIF_TYPE_SUBSCRIPTION_DEFERRED = 9;
type NOTIF_TYPE_SUBSCRIPTION_PAUSED = 10;
type NOTIF_TYPE_SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11;
type NOTIF_TYPE_SUBSCRIPTION_REVOKED = 12;
type NOTIF_TYPE_SUBSCRIPTION_EXPIRED = 13;

type NOTIFICATION_TYPES = NOTIF_TYPE_SUBSCRIPTION_RECOVERED
    | NOTIF_TYPE_SUBSCRIPTION_RENEWED
    | NOTIF_TYPE_SUBSCRIPTION_CANCELED
    | NOTIF_TYPE_SUBSCRIPTION_PURCHASED
    | NOTIF_TYPE_SUBSCRIPTION_ON_HOLD
    | NOTIF_TYPE_SUBSCRIPTION_IN_GRACE_PERIOD
    | NOTIF_TYPE_SUBSCRIPTION_RESTARTED
    | NOTIF_TYPE_SUBSCRIPTION_PRICE_CHANGE_CONFIRMED
    | NOTIF_TYPE_SUBSCRIPTION_DEFERRED
    | NOTIF_TYPE_SUBSCRIPTION_PAUSED
    | NOTIF_TYPE_SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED
    | NOTIF_TYPE_SUBSCRIPTION_REVOKED
    | NOTIF_TYPE_SUBSCRIPTION_EXPIRED;

interface DeveloperNotification {
    version: string,
    packageName: string,
    eventTimeMillis: number,
    subscriptionNotification: {
        version: string, // Always "1.0"

        notificationType: NOTIFICATION_TYPES,

        // The token provided to the user's device when the subscription was purchased.
        purchaseToken: string,

        // The purchased subscription ID (for example, "monthly001").
        subscriptionId: string
    }
}

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

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello, Google",
        })
    }
}
