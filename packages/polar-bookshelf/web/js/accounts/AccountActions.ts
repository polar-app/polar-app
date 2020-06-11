import {Firebase} from '../firebase/Firebase';
import {Fetches, RequestInit} from 'polar-shared/src/util/Fetch';
import {accounts} from 'polar-accounts/src/accounts';
import {PersistenceLayerController} from "../datastore/PersistenceLayerManager";
import * as firebase from "firebase/app";
import 'firebase/auth';
import {LoginURLs} from "../apps/viewer/LoginURLs";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class AccountActions {

    public static logout(persistenceLayerController: PersistenceLayerController) {

        persistenceLayerController.reset();

        // FIXME: refactor this completely , redirect to /do-logout, then, once that's complete,
        // redirect to #logout.

        firebase.auth().signOut()
            .then(() => {

                window.location.reload();

            })
            .catch(err => log.error("Unable to logout: ", err));

    }

    public static login() {
        const newLocation = LoginURLs.create();
        window.location.href = newLocation;
    }


    public static async cancelSubscription() {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeCancelSubscription/`;
        const data = await this.createAccountData();

        await this.executeAccountMethod(url, data);

    }

    public static async changePlan(plan: accounts.Plan, interval: accounts.Interval) {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeChangePlan/`;
        const accountData = await this.createAccountData();
        const data = {plan, interval, ...accountData};

        await this.executeAccountMethod(url, data);

    }

    private static async executeAccountMethod(url: string, data: any) {

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

    private static async createAccountData(): Promise<AccountData> {

        const user = await Firebase.currentUser();

        if (! user) {
            throw new Error("No account");
        }

        return {
            email: user.email!,
            uid: user.uid
        };

    }

}

interface AccountData {
    readonly email: string;
    readonly uid: string;
}
