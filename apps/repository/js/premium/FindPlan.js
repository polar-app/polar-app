"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPlan = void 0;
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const react_1 = __importDefault(require("react"));
exports.FindPlan = ReactUtils_1.deepMemo(() => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", { className: "text-tint text-left" },
            "Find a plan",
            react_1.default.createElement("br", null)),
        react_1.default.createElement("p", null, "We have both yearly and monthly plans.  Get a free month of service if you buy for a whole year!")));
});
//# sourceMappingURL=FindPlan.js.map