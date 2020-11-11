"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewerCallbacks = exports.useReviewerStore = exports.ReviewerStoreProvider = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const initialStore = {
    initialized: false,
    taskRep: undefined,
    pending: [],
    finished: 0,
    total: 0,
    ratings: [],
    hasSuspended: undefined,
    hasFinished: undefined,
    doFinished: Functions_1.ASYNC_NULL_FUNCTION,
    doSuspended: Functions_1.ASYNC_NULL_FUNCTION,
    doRating: Functions_1.ASYNC_NULL_FUNCTION
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    return React.useMemo(() => {
        function reset() {
            setStore({
                initialized: false,
                taskRep: undefined,
                pending: [],
                finished: 0,
                total: 0,
                doFinished: Functions_1.ASYNC_NULL_FUNCTION,
                doSuspended: Functions_1.ASYNC_NULL_FUNCTION,
                doRating: Functions_1.ASYNC_NULL_FUNCTION,
                ratings: [],
                hasSuspended: undefined,
                hasFinished: undefined,
            });
        }
        function init(taskReps, doRating, doSuspended, doFinished) {
            const pending = [...taskReps];
            const total = taskReps.length;
            setStore({
                initialized: true,
                taskRep: pending.shift(),
                pending,
                total,
                finished: 0,
                doRating,
                doSuspended,
                doFinished,
                ratings: [],
                hasFinished: undefined,
                hasSuspended: undefined
            });
        }
        function next(rating) {
            const store = storeProvider();
            const pending = [...store.pending];
            const taskRep = pending.shift();
            if (!taskRep) {
                setStore(Object.assign(Object.assign({}, store), { taskRep: undefined, ratings: [...store.ratings, rating] }));
                onFinished();
                return true;
            }
            const finished = store.finished + 1;
            console.log(`next: finished: ${finished}, nr pending: ${pending.length}`);
            setStore(Object.assign(Object.assign({}, store), { pending,
                taskRep,
                finished, ratings: [...store.ratings, rating] }));
            return false;
        }
        function handleAsyncCallback(delegate) {
            function handleError(err) {
                dialogs.snackbar({ type: 'error', message: err.message });
            }
            delegate()
                .catch(handleError);
        }
        function onRating(taskRep, rating) {
            console.log("ReviewerStore: onRating: " + rating);
            handleAsyncCallback(() => __awaiter(this, void 0, void 0, function* () { return storeProvider().doRating(taskRep, rating); }));
            next(rating);
        }
        function onSuspended() {
            console.log("ReviewerStore: onSuspended");
            const store = storeProvider();
            const { taskRep } = store;
            setStore(Object.assign(Object.assign({}, store), { hasSuspended: true }));
            if (!taskRep) {
                return;
            }
            handleAsyncCallback(() => __awaiter(this, void 0, void 0, function* () { return store.doSuspended(taskRep); }));
            reset();
        }
        function onFinished() {
            console.log("ReviewerStore: onFinished");
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { hasFinished: true }));
            handleAsyncCallback(() => __awaiter(this, void 0, void 0, function* () { return storeProvider().doFinished(); }));
        }
        function onReset() {
            reset();
        }
        return {
            init, next, onRating, onSuspended, onFinished, onReset
        };
    }, [dialogs, setStore, storeProvider]);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.ReviewerStoreProvider = _a[0], exports.useReviewerStore = _a[1], exports.useReviewerCallbacks = _a[2];
//# sourceMappingURL=ReviewerStore.js.map