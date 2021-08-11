export type V2PlanLevel = 'free' | 'plus' | 'pro';

export interface V2Plan {
    readonly ver: 'v2',
    readonly level: V2PlanLevel;
}
