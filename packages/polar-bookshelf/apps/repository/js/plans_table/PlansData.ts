import {Billing} from "polar-accounts/src/Billing";

export enum PlanFeature {
    Storage = "Storage",
    WebCaptures = "WebCaptures",
    Reading = "Reading",
    PrioritySupport = "PrioritySupport",
    RelatedTags = "RelatedTags",
    AutoFlashcards = "AutoFlashcards",
    Onboarding = "Onboarding",
}

export enum PlanPricingInterval {
    Monthly = 'month',
    Yearly = 'year',
}

export const PLAN_INTERVAL_MONTHS: Record<PlanPricingInterval, number> = {
    [PlanPricingInterval.Monthly]: 1,
    [PlanPricingInterval.Yearly]: 12,
};

export type Plan = {
    readonly type: Billing.V2Plan;
    readonly label: string;
    readonly price: Record<PlanPricingInterval, number>;
    readonly features: Record<PlanFeature, string | boolean>;
    readonly subtitle: string;
};

export const PLAN_FEATURE_LABELS: Record<PlanFeature, string> = {
    [PlanFeature.Onboarding]: 'Onboarding',
    [PlanFeature.AutoFlashcards]: 'Auto-create flashcards (using GPT-3)',
    [PlanFeature.RelatedTags]: 'Related Tags',
    [PlanFeature.PrioritySupport]: 'Priority Support',
    [PlanFeature.Storage]: 'Storage',
    [PlanFeature.WebCaptures]: 'Maximum Captured Web Documents',
    [PlanFeature.Reading]: 'Reading',
};

export const PLANS: Record<Billing.V2PlanLevel, Plan> = {
    free: {
        type: Billing.V2PlanFree,
        label: 'Free',
        subtitle: '1 year commitment <br /> gets one month free',
        price: {
            [PlanPricingInterval.Monthly]: 0,
            [PlanPricingInterval.Yearly]: 0,
        },
        features: {
            [PlanFeature.Onboarding]: false,
            [PlanFeature.AutoFlashcards]: false,
            [PlanFeature.RelatedTags]: false,
            [PlanFeature.PrioritySupport]: false,
            [PlanFeature.Storage]: '1 GB',
            [PlanFeature.WebCaptures]: '250',
            [PlanFeature.Reading]: 'No',
        },
    },
    plus: {
        type: Billing.V2PlanPlus,
        label: 'Plus',
        subtitle: '1 year commitment <br /> gets one month free',
        price: {
            [PlanPricingInterval.Monthly]: 6.99,
            [PlanPricingInterval.Yearly]: 74.99,
        },
        features: {
            [PlanFeature.Onboarding]: true,
            [PlanFeature.AutoFlashcards]: "100 / mo",
            [PlanFeature.RelatedTags]: true,
            [PlanFeature.PrioritySupport]: true,
            [PlanFeature.Storage]: '50 GB',
            [PlanFeature.WebCaptures]: 'Unlimited',
            [PlanFeature.Reading]: 'Yes',
        },
    },
    pro: {
        type: Billing.V2PlanPro,
        label: 'Pro',
        subtitle: 'Free Forever',
        price: {
            [PlanPricingInterval.Monthly]: 14.99,
            [PlanPricingInterval.Yearly]: 164.99,
        },
        features: {
            [PlanFeature.Onboarding]: true,
            [PlanFeature.AutoFlashcards]: "200 / mo",
            [PlanFeature.RelatedTags]: true,
            [PlanFeature.PrioritySupport]: true,
            [PlanFeature.Storage]: '500 GB',
            [PlanFeature.WebCaptures]: 'Unlimited',
            [PlanFeature.Reading]: 'Yes',
        },
    },
};
