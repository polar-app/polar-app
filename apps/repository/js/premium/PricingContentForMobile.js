"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingContentForMobile = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
const PurchaseOrChangePlanButton_1 = require("./PurchaseOrChangePlanButton");
const PlanCheckIcon_1 = require("./PlanCheckIcon");
const PlanPricing_1 = require("./PlanPricing");
const PlanIntervalToggle_1 = require("./PlanIntervalToggle");
const PricingStore_1 = require("./PricingStore");
const Billing_1 = require("polar-accounts/src/Billing");
var V2PlanPlus = Billing_1.Billing.V2PlanPlus;
var V2PlanPro = Billing_1.Billing.V2PlanPro;
var V2PlanFree = Billing_1.Billing.V2PlanFree;
const useStyles = core_1.makeStyles({
    checkCircle: {
        maxHeight: "24px",
    },
    headerMobile: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "38px",
        lineHeight: "33px",
        marginTop: "30px",
    },
    imgBox: {
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
    },
    divider: {
        marginLeft: "4%",
        width: "92%",
    },
    row: {
        height: "55px",
    },
    pricing: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "32px",
        lineHeight: "37px",
        letterSpacing: "0.15px",
        color: "#E0E0E0",
        margin: "20px 0",
    },
    rate: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "14px",
        letterSpacing: "0.15px",
        color: "#E0E0E0",
    },
    subtitleMobile: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "19px",
        textAlign: "center",
        letterSpacing: "0.15px",
        marginTop: "5px",
        color: "#E0E0E0",
        paddingBottom: "8%",
    },
    rowHeadMobile: {
        textAlign: "left",
    },
    pricePlanMobile: {
        mixBlendMode: "normal",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        margin: "5px",
    },
    tableMobile: {
        mixBlendMode: "normal",
        borderCollapse: "collapse",
        textAlign: "center",
        fontSize: "16px",
        width: '100%',
        marginLeft: '1rem',
        marginRight: '1rem',
    },
});
const CheckRow = (props) => {
    const classes = useStyles();
    return (react_1.default.createElement("tr", { className: classes.row },
        react_1.default.createElement("td", { className: classes.rowHeadMobile }, props.name),
        react_1.default.createElement("td", null,
            react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                props.checked && (react_1.default.createElement(PlanCheckIcon_1.PlanCheckIcon, null)),
                !props.checked && (react_1.default.createElement(MUIFontAwesome_1.FATimesCircleIcon, { className: classes.checkCircle }))))));
};
const PlanBox = (props) => {
    const classes = useStyles();
    return (react_1.default.createElement(core_1.Paper, { elevation: 1, style: { margin: '1rem' } },
        react_1.default.createElement(core_1.Box, { className: classes.pricePlanMobile },
            react_1.default.createElement(core_1.Box, { className: classes.pricing }, props.name),
            react_1.default.createElement(core_1.Box, { className: classes.subtitleMobile }, props.subtitle),
            react_1.default.createElement(core_1.Box, { className: classes.pricing },
                react_1.default.createElement(PlanPricing_1.PlanPricing, { plan: props.plan.level })),
            react_1.default.createElement(PurchaseOrChangePlanButton_1.PurchaseOrChangePlanButton, { newSubscription: { plan: props.plan, interval: props.interval } }),
            react_1.default.createElement("table", { className: classes.tableMobile },
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHeadMobile }, "Storage"),
                    react_1.default.createElement("td", null, props.storage)),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHeadMobile },
                        "Maximum Captured ",
                        react_1.default.createElement("br", null),
                        " Web Documents"),
                    react_1.default.createElement("td", null, props.maxCapturedWebDocuments)),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHeadMobile }, "Devices"),
                    react_1.default.createElement("td", null, props.maxDevices)),
                react_1.default.createElement(CheckRow, { name: "Priority Support", checked: props.support }),
                react_1.default.createElement(CheckRow, { name: "Related Tags", checked: props.relatedTags })))));
};
exports.PricingContentForMobile = () => {
    const { interval } = PricingStore_1.usePricingStore(['interval']);
    return (react_1.default.createElement(core_1.Box, { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "40px",
        } },
        react_1.default.createElement("div", { style: { margin: '1em auto 1em auto' } },
            react_1.default.createElement(PlanIntervalToggle_1.PlanIntervalToggle, null)),
        react_1.default.createElement(PlanBox, { name: "Free", plan: V2PlanFree, interval: interval, subtitle: "Free Forever", storage: "1 GB", maxCapturedWebDocuments: 250, maxDevices: 2, support: false, relatedTags: false }),
        react_1.default.createElement(PlanBox, { name: "Plus", plan: V2PlanPlus, interval: interval, subtitle: react_1.default.createElement(react_1.default.Fragment, null,
                "1 year commitment ",
                react_1.default.createElement("br", null),
                " gets one month free"), storage: "50 GB", maxCapturedWebDocuments: "unlimited", maxDevices: "unlimited", support: true, relatedTags: true }),
        react_1.default.createElement(PlanBox, { name: "Pro", plan: V2PlanPro, interval: interval, subtitle: react_1.default.createElement(react_1.default.Fragment, null,
                "1 year commitment ",
                react_1.default.createElement("br", null),
                " gets one month free"), storage: "500 GB", maxCapturedWebDocuments: "unlimited", maxDevices: "unlimited", support: true, relatedTags: true })));
};
//# sourceMappingURL=PricingContentForMobile.js.map