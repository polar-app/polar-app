"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoProvider = exports.useUserSubscriptionContext = exports.useUserInfoContext = void 0;
const react_1 = __importDefault(require("react"));
const AuthHandler_1 = require("./AuthHandler");
const FirestoreProvider_1 = require("../../../../../apps/repository/js/FirestoreProvider");
const AccountSnapshots_1 = require("../../../accounts/AccountSnapshots");
const ReactUtils_1 = require("../../../react/ReactUtils");
const Snapshots_1 = require("polar-shared/src/util/Snapshots");
const UseSnapshotSubscriber_1 = require("../../../ui/data_loader/UseSnapshotSubscriber");
const Billing_1 = require("polar-accounts/src/Billing");
var V2PlanFree = Billing_1.Billing.V2PlanFree;
const Plans_1 = require("polar-accounts/src/Plans");
const UserInfoContext = react_1.default.createContext(undefined);
function useUserInfoContext() {
    return react_1.default.useContext(UserInfoContext);
}
exports.useUserInfoContext = useUserInfoContext;
function useUserSubscriptionContext() {
    var _a;
    const userInfoContext = useUserInfoContext();
    const subscription = (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription;
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
    const { user, firestore } = FirestoreProvider_1.useFirestore();
    if (!user) {
        return {
            id: 'no-user',
            subscribe: Snapshots_1.SnapshotSubscribers.of({ userInfo: undefined })
        };
    }
    const accountSnapshotSubscriber = AccountSnapshots_1.AccountSnapshots.create(firestore, user.uid);
    function toUserInfoContext(account) {
        if (!user) {
            return undefined;
        }
        const userInfo = AuthHandler_1.toUserInfo(user, account === null || account === void 0 ? void 0 : account.value);
        return { userInfo };
    }
    const subscribe = Snapshots_1.SnapshotSubscribers.converted(accountSnapshotSubscriber, toUserInfoContext);
    return { id: 'user-info-context:' + user.uid, subscribe };
}
exports.UserInfoProvider = ReactUtils_1.deepMemo((props) => {
    const snapshotSubscriber = useUserInfoContextSnapshotSubscriber();
    const { value, error } = UseSnapshotSubscriber_1.useSnapshotSubscriber(snapshotSubscriber);
    if (error) {
        console.error("Could not get user info: ", error);
        return null;
    }
    return (react_1.default.createElement(UserInfoContext.Provider, { value: value }, props.children));
});
//# sourceMappingURL=UserInfoProvider.js.map