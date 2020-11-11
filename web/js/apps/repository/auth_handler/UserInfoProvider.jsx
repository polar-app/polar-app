"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoProvider = exports.useUserSubscriptionContext = exports.useUserInfoContext = void 0;
var react_1 = require("react");
var AuthHandler_1 = require("./AuthHandler");
var FirestoreProvider_1 = require("../../../../../apps/repository/js/FirestoreProvider");
var AccountSnapshots_1 = require("../../../accounts/AccountSnapshots");
var ReactUtils_1 = require("../../../react/ReactUtils");
var Snapshots_1 = require("polar-shared/src/util/Snapshots");
var UseSnapshotSubscriber_1 = require("../../../ui/data_loader/UseSnapshotSubscriber");
var Billing_1 = require("polar-accounts/src/Billing");
var V2PlanFree = Billing_1.Billing.V2PlanFree;
var Plans_1 = require("polar-accounts/src/Plans");
/**
 * The IUserInfoContext or undefined if it has not yet been set.
 */
var UserInfoContext = react_1.default.createContext(undefined);
function useUserInfoContext() {
    return react_1.default.useContext(UserInfoContext);
}
exports.useUserInfoContext = useUserInfoContext;
function useUserSubscriptionContext() {
    var _a;
    var userInfoContext = useUserInfoContext();
    var subscription = (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription;
    if (subscription) {
        return {
            plan: Plans_1.Plans.toV2(subscription.plan),
            interval: subscription.interval
        };
    }
    else {
        return {
            plan: V2PlanFree,
            interval: 'month'
        };
    }
}
exports.useUserSubscriptionContext = useUserSubscriptionContext;
function useUserInfoContextSnapshotSubscriber() {
    var _a = FirestoreProvider_1.useFirestore(), user = _a.user, firestore = _a.firestore;
    if (!user) {
        return {
            id: 'no-user',
            subscribe: Snapshots_1.SnapshotSubscribers.of({ userInfo: undefined })
        };
    }
    var accountSnapshotSubscriber = AccountSnapshots_1.AccountSnapshots.create(firestore, user.uid);
    function toUserInfoContext(account) {
        if (!user) {
            return undefined;
        }
        var userInfo = AuthHandler_1.toUserInfo(user, account === null || account === void 0 ? void 0 : account.value);
        return { userInfo: userInfo };
    }
    var subscribe = Snapshots_1.SnapshotSubscribers.converted(accountSnapshotSubscriber, toUserInfoContext);
    return { id: 'user-info-context:' + user.uid, subscribe: subscribe };
}
// TODO: migrate this to a store so that the entire UI doesn't need to be
// repainted.
exports.UserInfoProvider = ReactUtils_1.deepMemo(function (props) {
    var snapshotSubscriber = useUserInfoContextSnapshotSubscriber();
    // TODO: should we use on onError here with the dialog manager
    var _a = UseSnapshotSubscriber_1.useSnapshotSubscriber(snapshotSubscriber), value = _a.value, error = _a.error;
    if (error) {
        console.error("Could not get user info: ", error);
        // TODO: this needs to raise an error in the UI but MUIDialogController
        // is deeper in the tree
        return null;
    }
    return (<UserInfoContext.Provider value={value}>
            {props.children}
        </UserInfoContext.Provider>);
});
