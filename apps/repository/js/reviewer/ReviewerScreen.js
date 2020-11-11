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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewerScreen = void 0;
const React = __importStar(require("react"));
const Reviewers_1 = require("./Reviewers");
const FirestoreProvider_1 = require("../FirestoreProvider");
const Reviewer_1 = require("./Reviewer");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const ReviewerStore_1 = require("./ReviewerStore");
exports.ReviewerScreen = ReactUtils_1.deepMemo((props) => {
    const firestoreContext = FirestoreProvider_1.useFirestore();
    const reviewerProvider = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        return yield Reviewers_1.Reviewers.create(Object.assign({ firestore: firestoreContext }, props));
    }), [firestoreContext, props]);
    return (React.createElement(ReviewerStore_1.ReviewerStoreProvider, null,
        React.createElement(Reviewer_1.Reviewer, { reviewerProvider: reviewerProvider })));
});
//# sourceMappingURL=ReviewerScreen.js.map