import * as React from 'react';
import {Firebase} from '../firebase/Firebase';
import {Fetches, RequestInit} from 'polar-shared/src/util/Fetch';
import {Billing} from "polar-accounts/src/Billing";
import firebase from 'firebase/app'
import 'firebase/auth';
import {LoginURLs} from "../apps/viewer/LoginURLs";
import {Firestore} from "../firebase/Firestore";
import {StripeMode} from "../../../../polar-app-private/polar-hooks/functions/impl/stripe/StripeUtils";
import {StripeUtils} from "../../../apps/repository/js/stripe/StripeUtils";
import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {IStripeCreateCustomerPortalResponse} from "polar-backend-api/src/api/stripe/StripeCreateCustomerPortal";

export namespace AccountActions {

    export async function logout() {

        await firebase.auth().signOut();
        const firestore = await Firestore.getInstance();
        await firestore.terminate();
        await firestore.clearPersistence();

    }

    export function login() {
        window.location.href = LoginURLs.create();
    }

    export function useRedirectToStripeCustomerPortal() {

        // const linkLoader = useLinkLoader();

        return React.useCallback(async () => {

            const stripeMode = StripeUtils.stripeMode();
            const response: IStripeCreateCustomerPortalResponse = await JSONRPC.exec('StripeCreateCustomerPortal', {stripeMode});

            // right now we can't trigger opening the URL here as it's blocked
            // because it's not computed within the event.
            document.location.href = response.url;

            // linkLoader(response.url, {
            //     newWindow: true,
            //     focus: true
            // });

        }, []);

    }

    export async function cancelSubscription() {
        const url = StripeUtils.createURL(`/StripeCancelSubscription/`);
        const accountData = await createAccountData();
        const mode = StripeUtils.stripeMode();
        const data: StripeCancelSubscriptionBody = {mode, ...accountData};

        await executeAccountMethod(url, data);
    }

    export async function changePlan(plan: Billing.V2PlanLevel, interval: Billing.Interval) {
        const url = StripeUtils.createURL(`/StripeChangePlan/`);
        const accountData = await createAccountData();
        const mode = StripeUtils.stripeMode();
        const data: StripeChangePlanBody = {mode, plan, interval, ...accountData};

        await executeAccountMethod(url, data);

    }

    async function executeAccountMethod(url: string, data: any) {

        const body = JSON.stringify(data);

        const init: RequestInit = {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body
        };

        const response = await Fetches.fetch(url, init);

        if (response.status !== 200) {
            throw new Error("Request: " + response.status + ": " + response.statusText);
        }

    }

    async function createAccountData(): Promise<AccountData> {

        const user = Firebase.currentUser();

        if (! user) {
            throw new Error("No account");
        }

        return {
            uid: user.uid,
            email: user.email!,
        };

    }

}

interface AccountData {
    readonly uid: string;
    readonly email: string;
}

interface StripeCancelSubscriptionBody extends AccountData {
    readonly uid: string;
    readonly email: string;
    readonly mode: StripeMode;
}

interface StripeChangePlanBody extends AccountData {
    readonly plan: Billing.PlanLike;
    readonly interval: Billing.Interval;
    readonly mode: StripeMode;
}
