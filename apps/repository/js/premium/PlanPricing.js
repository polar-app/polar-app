"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPricing = void 0;
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const PricingStore_1 = require("./PricingStore");
const react_1 = __importDefault(require("react"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const Numbers_1 = require("polar-shared/src/util/Numbers");
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    price: {
        fontSize: '30px',
        margin: 0
    },
    regularPrice: {
        fontSize: '22px',
        margin: 0
    },
    interval: {
        fontSize: '15px',
        color: theme.palette.text.hint
    },
    billedAt: {
        fontSize: '1.3rem',
        lineHeight: '1.4rem',
        color: theme.palette.text.hint
    },
}));
var PlanPrices;
(function (PlanPrices) {
    function computeMonthPrice(plan) {
        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 6.99;
            case "pro":
                return 14.99;
        }
    }
    PlanPrices.computeMonthPrice = computeMonthPrice;
    function computeYearPrice(plan) {
        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 74.99;
            case "pro":
                return 164.99;
        }
    }
    PlanPrices.computeYearPrice = computeYearPrice;
    function compute4YearPrice(plan) {
        switch (plan) {
            case "free":
                return 0.0;
            case "plus":
                return 164.99;
            case "pro":
                return 399.99;
        }
    }
    PlanPrices.compute4YearPrice = compute4YearPrice;
})(PlanPrices || (PlanPrices = {}));
exports.PlanPricing = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    const { plan } = props;
    const { interval } = PricingStore_1.usePricingStore(['interval']);
    const computePrice = () => {
        function computePriceFromInterval() {
            switch (interval) {
                case "month":
                    return PlanPrices.computeMonthPrice(plan);
                case "year":
                    return PlanPrices.computeYearPrice(plan);
                case "4year":
                    return PlanPrices.compute4YearPrice(plan);
            }
        }
        function intervalToMonths() {
            switch (interval) {
                case "month":
                    return 1;
                case "year":
                    return 12;
                case "4year":
                    return 48;
            }
        }
        const price = computePriceFromInterval();
        const priceNormalizedPerMonth = Numbers_1.Numbers.toFixedFloat(price / intervalToMonths(), 2);
        const regularPrice = PlanPrices.computeMonthPrice(plan);
        return { price, discount: undefined, priceNormalizedPerMonth, regularPrice };
    };
    const pricing = computePrice();
    if (pricing.discount !== undefined) {
        return react_1.default.createElement("div", null,
            react_1.default.createElement("s", null,
                react_1.default.createElement("h3", { className: "" },
                    "$",
                    pricing.discount.before,
                    react_1.default.createElement("span", { className: "" },
                        "/",
                        interval))),
            react_1.default.createElement("h3", { className: "" },
                "$",
                pricing.discount.after,
                react_1.default.createElement("span", { className: "" },
                    "/",
                    interval)));
    }
    else {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h3", { className: classes.price },
                "$",
                pricing.priceNormalizedPerMonth,
                react_1.default.createElement("span", { className: classes.interval }, "/month")),
            (interval !== 'month' && plan !== 'free') && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("s", null,
                    react_1.default.createElement("h3", { className: classes.regularPrice },
                        "$",
                        pricing.regularPrice,
                        react_1.default.createElement("span", { className: classes.interval }, "/month"))),
                interval === 'year' && (react_1.default.createElement("p", { className: classes.billedAt },
                    "Billed yearly at $",
                    pricing.price)),
                interval === '4year' && (react_1.default.createElement("p", { className: classes.billedAt },
                    "Billed once at $",
                    pricing.price))))));
    }
});
//# sourceMappingURL=PlanPricing.js.map