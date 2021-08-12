export type Customer = {
    readonly type: 'stripe' | 'apple_iap' | 'google_iap';
    readonly customerID: string;
};
