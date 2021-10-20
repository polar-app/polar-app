import React from 'react';
import {toUserInfo, UserInfo} from "./AuthHandler"
import {useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {AccountSnapshots} from "../../../accounts/AccountSnapshots";
import {deepMemo} from "../../../react/ReactUtils";
import {SnapshotSubscribers, SnapshotSubscriberWithID} from "polar-shared/src/util/Snapshots";
import {useSnapshotSubscriber} from "../../../ui/data_loader/UseSnapshotSubscriber";
import {Billing} from 'polar-accounts/src/Billing';
import {Plans} from "polar-accounts/src/Plans";
import {ISnapshot} from "../../../snapshots/CachedSnapshotSubscriberContext";
import {useAnalytics} from "../../../analytics/Analytics";
import {IAccount} from "polar-firebase/src/firebase/om/AccountCollection";
import V2PlanFree = Billing.V2PlanFree;

interface IUserInfoContext {

    /**
     * The UserInfo or undefined if the user is not logged in.
     */
    readonly userInfo: UserInfo | undefined;

}

/**
 * The IUserInfoContext or undefined if it has not yet been set.
 */
const UserInfoContext = React.createContext<IUserInfoContext | undefined>(undefined);

export function useUserInfoContext() {
    return React.useContext(UserInfoContext);
}

export function useUserSubscriptionContext(): Billing.V2Subscription {
   const userInfoContext = useUserInfoContext();
   const subscription = userInfoContext?.userInfo?.subscription;

   if (subscription) {
       return {
           plan: Plans.toV2(subscription.plan),
           interval: subscription.interval
       };
   } else {
       return {
           plan: V2PlanFree,
           interval: 'month'
       };
   }
}

interface IProps {
    readonly children: React.ReactNode;
}

function useUserInfoContextSnapshotSubscriber(): SnapshotSubscriberWithID<IUserInfoContext> {

    const {user, firestore} = useFirestore();

    if (! user) {
        return {
            id: 'no-user',
            subscribe: SnapshotSubscribers.of({userInfo: undefined})
        };
    }

    const accountSnapshotSubscriber = AccountSnapshots.create(firestore, user.uid);

    function toUserInfoContext(account: ISnapshot<IAccount> | undefined): IUserInfoContext | undefined {

        if (! user) {
            return undefined;
        }

        const userInfo = toUserInfo(user, account?.value);
        return {userInfo};

    }

    const subscribe = SnapshotSubscribers.converted<ISnapshot<IAccount> | undefined, IUserInfoContext>(accountSnapshotSubscriber, toUserInfoContext);
    return {id: 'user-info-context:' + user.uid, subscribe};

}


const UserInfoTraits = React.memo(function UserInfoTraits() {

    const analytics = useAnalytics();

    const userInfoContext = useUserInfoContext();

    if (userInfoContext) {

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan);
        const interval = userInfoContext?.userInfo?.subscription.interval || 'month';

        analytics.traits({
            subscription_plan: plan.level,
            subscription_interval: interval
        });

    }

    return null;

});

// TODO: migrate this to a store so that the entire UI doesn't need to be
// repainted when this data is updated.
export const UserInfoProvider = deepMemo(function UserInfoProvider(props: IProps) {

    const snapshotSubscriber = useUserInfoContextSnapshotSubscriber();

    // TODO: should we use on onError here with the dialog manager
    const {value, error} = useSnapshotSubscriber(snapshotSubscriber);

    if (error) {
        console.error("Could not get user info: ", error);
        // TODO: this needs to raise an error in the UI but MUIDialogController
        // is deeper in the tree
        return null;
    }

    return (
        <UserInfoContext.Provider value={value!}>
            <>
                <UserInfoTraits/>
                {props.children}
            </>
        </UserInfoContext.Provider>
    )

});
