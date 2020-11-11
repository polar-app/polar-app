/// <reference types="@stripe/stripe-js/types/stripe-js/checkout" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/base" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/card" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/card-number" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/card-expiry" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/card-cvc" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/iban" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/ideal-bank" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/fpx-bank" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/payment-request-button" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements/au-bank-account" />
/// <reference types="@stripe/stripe-js/types/stripe-js/payment-intents" />
/// <reference types="@stripe/stripe-js/types/stripe-js/setup-intents" />
/// <reference types="@stripe/stripe-js/types/stripe-js/payment-request" />
/// <reference types="@stripe/stripe-js/types/stripe-js/token-and-sources" />
/// <reference types="@stripe/stripe-js/types/api/shared" />
/// <reference types="@stripe/stripe-js/types/api/paymentmethods" />
/// <reference types="@stripe/stripe-js/types/api/paymentintents" />
/// <reference types="@stripe/stripe-js/types/api/setupintents" />
/// <reference types="@stripe/stripe-js/types/api/sources" />
/// <reference types="@stripe/stripe-js/types/api/tokens" />
/// <reference types="@stripe/stripe-js/types/api/bankaccounts" />
/// <reference types="@stripe/stripe-js/types/api/cards" />
/// <reference types="@stripe/stripe-js" />
/// <reference types="@stripe/stripe-js/types/stripe-js/elements" />
/// <reference types="@stripe/stripe-js/types/stripe-js" />
export declare namespace StripeUtils {
    type StripeMode = 'test' | 'live';
    function createURL(path: string): string;
    function stripeMode(): StripeMode;
    function getStripeAPIKey(): string;
    function createStripe(): Promise<import("@stripe/stripe-js").Stripe | null>;
}
