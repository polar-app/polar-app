"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreProvider = exports.useFirestore = void 0;
const react_1 = __importDefault(require("react"));
const Firestore_1 = require("../../../web/js/firebase/Firestore");
const FirestoreCollections_1 = require("./reviewer/FirestoreCollections");
const Firebase_1 = require("../../../web/js/firebase/Firebase");
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
const ReactLifecycleHooks_1 = require("../../../web/js/hooks/ReactLifecycleHooks");
const FirestoreContext = react_1.default.createContext(null);
function useFirestore() {
    return react_1.default.useContext(FirestoreContext);
}
exports.useFirestore = useFirestore;
function doAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = yield Firestore_1.Firestore.getInstance();
        const user = Firebase_1.Firebase.currentUser();
        const uid = user === null || user === void 0 ? void 0 : user.uid;
        yield FirestoreCollections_1.FirestoreCollections.configure(firestore);
        return {
            firestore, uid,
            user: user || undefined
        };
    });
}
exports.FirestoreProvider = ReactUtils_1.deepMemo((props) => {
    const data = ReactLifecycleHooks_1.useAsyncWithError({ promiseFn: doAsync });
    if (data) {
        return (react_1.default.createElement(FirestoreContext.Provider, { value: data }, props.children));
    }
    return null;
});
//# sourceMappingURL=FirestoreProvider.js.map