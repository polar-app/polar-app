export type Customer = {
    readonly type: 'stripe' | 'apple_iap';
    readonly customerID: string;
};
