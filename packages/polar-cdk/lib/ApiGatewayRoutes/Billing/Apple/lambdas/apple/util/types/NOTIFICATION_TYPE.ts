// Occurs at the user’s initial purchase of the subscription.
// Store latest_receipt on your server as a token to verify the user’s subscription
// status at any time by validating it with the App Store.
type TYPE_INITIAL_BUY = "INITIAL_BUY";

// Indicates the customer renewed a subscription interactively,
// either by using your app’s interface, or on the App Store in the account’s Subscriptions settings
// Make service available immediately.
type TYPE_INTERACTIVE_RENEWAL = "INTERACTIVE_RENEWAL";

// Indicates that a customer’s subscription has successfully auto-renewed for a new transaction period.
type TYPE_DID_RENEW = "DID_RENEW";

type TYPE_DID_CHANGE_RENEWAL_STATUS = 'DID_CHANGE_RENEWAL_STATUS';

export type NOTIFICATION_TYPE =
    TYPE_INITIAL_BUY
    | TYPE_DID_CHANGE_RENEWAL_STATUS
    | TYPE_INTERACTIVE_RENEWAL
    | TYPE_DID_RENEW;
