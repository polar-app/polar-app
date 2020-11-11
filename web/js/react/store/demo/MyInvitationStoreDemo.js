"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMyInvitationStoreCallbacks = exports.useMyInvitationStore = exports.MyInvitationStoreProvider = void 0;
const ObservableStore_1 = require("../ObservableStore");
const TagStoreDemo_1 = require("./TagStoreDemo");
const invitationStore = {
    invited: false
};
class InvitationCallbacks {
    constructor(store, setStore) {
        this.store = store;
        this.setStore = setStore;
    }
    toggleInvited() {
        const invited = !this.store.current.invited;
        this.setStore({ invited });
    }
}
function mutatorFactory() {
    return {};
}
const useCallbacksFactory = (storeProvider, setStore, mutator) => {
    const tagStore = TagStoreDemo_1.useTagStore(undefined);
    return class {
        static toggleInvited() {
            const store = storeProvider();
            const invited = !store.invited;
            setStore({ invited });
        }
    };
};
_a = ObservableStore_1.createObservableStore({
    initialValue: invitationStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.MyInvitationStoreProvider = _a[0], exports.useMyInvitationStore = _a[1], exports.useMyInvitationStoreCallbacks = _a[2];
//# sourceMappingURL=MyInvitationStoreDemo.js.map