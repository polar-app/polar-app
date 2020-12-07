/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {Billing} from "polar-accounts/src/Billing";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Plans} from "polar-accounts/src/Plans";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPro = Billing.V2PlanPro;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";

const _1GB   =   1000000000;
const _2GB   =   2000000000;
const _50GB  =  50000000000;
const _500GB = 500000000000;

export namespace AccountUpgrades {

    import V2Plan = Billing.V2Plan;

    export function isV2Grandfathered(created: ISODateTimeString) {
        return ISODateTimeStrings.compare(created, '2020-10-15T00:00:00+0000') < 0;
    }

    export function computeStorageForPlan(accountCreated: ISODateTimeString | undefined,
                                          plan: V2Plan) {

        const grandfathered = accountCreated !== undefined ? isV2Grandfathered(accountCreated) : false;

        switch (plan.level) {

            case 'free':
                return grandfathered ? _2GB : _1GB;

            case 'plus':
                return _50GB;

            case 'pro':
                return _500GB;

        }

    }

    export type AccountUpgradeReason = 'none' | 'storage' | 'web-captures';

    export interface IRequiredPlan {
        readonly reason: AccountUpgradeReason;
        readonly plan: V2Plan;
    }

    /**
     * Get the required plan per the amount of data being used.
     */
    export function computeRequiredPlan(accountUsage: AccountUsage): IRequiredPlan {

        /**
         * Return true if the user is grandfathered for V2 pricing.
         */
        function computePlanForStorageWithLevels(free: number,
                                                 plus: number,
                                                 pro: number) {

            if (accountUsage.storageInBytes < free) {
                return V2PlanFree;
            }

            if (accountUsage.storageInBytes >= free && accountUsage.storageInBytes < plus) {
                return V2PlanPlus;
            }

            if (accountUsage.storageInBytes >= plus && accountUsage.storageInBytes < pro) {
                return V2PlanPro;
            }

            throw new Error("Too much storage: " + accountUsage.storageInBytes);

        }

        function computePlanForStorage() {

            function computeV2Grandfathered() {
                return computePlanForStorageWithLevels(_2GB, _50GB, _500GB);
            }

            function computeV2() {
                return computePlanForStorageWithLevels(_1GB, _50GB, _500GB);
            }

            if (isV2Grandfathered(accountUsage.created)) {
                return computeV2Grandfathered();
            } else {
                return computeV2();
            }

        }

        function computePlanForWebCaptures() {

            if (accountUsage.nrWebCaptures < 250) {
                return V2PlanFree;
            }

            return V2PlanPlus;

        }

        const planForStorage = computePlanForStorage();
        const planForWebCaptures = computePlanForWebCaptures();


        interface ILimit extends IRequiredPlan {
            readonly planAsInt: number;
        }

        const limits: ReadonlyArray<ILimit> = [
            {
                plan: planForStorage,
                reason: 'storage',
                planAsInt: Plans.toInt(planForStorage)
            },
            {
                plan: planForWebCaptures,
                reason: 'web-captures',
                planAsInt: Plans.toInt(planForWebCaptures)
            }
        ];

        return arrayStream(limits)
            .sort((a, b) => a.planAsInt - b.planAsInt)
            .last()!;

    }

    /**
     *
     * Force the user to upgrade to a plan.
     *
     * @param currentPlan current user plan.
     * @param accountUsage The data about the machine that we're needing to upgrade
     */
    export function computePlanRequiredForAccount(currentPlan: Billing.V2Plan,
                                                  accountUsage: AccountUsage): IRequiredPlan {

        const requiredPlan = computeRequiredPlan(accountUsage);

        if (Plans.toInt(currentPlan) < Plans.toInt(requiredPlan.plan)) {
            return {
                reason: requiredPlan.reason,
                plan: requiredPlan.plan,
            };
        }

        // their current plan is ok.
        return {
            reason: 'none',
            plan: currentPlan
        };

    }

}

export interface AccountUsage {

    /**
     * The time the account was created.
     */
    readonly created: ISODateTimeString;

    /**
     * The number of bytes of storage the user has.
     */
    readonly storageInBytes: number;

    /**
     * Number of web captures for this user.
     */
    readonly nrWebCaptures: number;

}
