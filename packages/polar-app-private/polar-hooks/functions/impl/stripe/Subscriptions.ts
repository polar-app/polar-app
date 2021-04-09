import {Billing} from "polar-accounts/src/Billing";
import {Accounts} from "./Accounts";
import {Plans} from "polar-accounts/src/Plans";

export namespace Subscriptions {

    import V2PlanFree = Billing.V2PlanFree;

    export async function getSubscriptionByEmail(email: string): Promise<Billing.V2Subscription> {

        const account = await Accounts.get(email);

        if (! account || ! account.plan) {

            return {
                plan: V2PlanFree,
                interval: 'month'
            };

        }

        return {
            plan: Plans.toV2(account.plan),
            interval: account.interval || 'month'
        };

    }

}