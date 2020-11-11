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
exports.Reviewer = void 0;
const React = __importStar(require("react"));
const ReviewerStore_1 = require("./ReviewerStore");
const ReviewerRunner_1 = require("./ReviewerRunner");
const ReviewerDialog_1 = require("./ReviewerDialog");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.Reviewer = ReactUtils_1.deepMemo((props) => {
    const { init } = ReviewerStore_1.useReviewerCallbacks();
    const log = MUILogger_1.useLogger();
    React.useEffect(() => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const reviewer = yield props.reviewerProvider();
                init(reviewer.taskReps, reviewer.doRating, reviewer.doSuspended, reviewer.doFinished);
            });
        }
        doAsync().catch(err => log.error(err));
    }, [init, log, props]);
    return (React.createElement(ReviewerDialog_1.ReviewerDialog, { className: "reviewer" },
        React.createElement(ReviewerRunner_1.ReviewerRunner, null)));
});
//# sourceMappingURL=Reviewer.js.map