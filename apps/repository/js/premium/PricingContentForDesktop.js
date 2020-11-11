"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingContentForDesktop = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
const PurchaseOrChangePlanButton_1 = require("./PurchaseOrChangePlanButton");
const PlanCheckIcon_1 = require("./PlanCheckIcon");
const PlanPricing_1 = require("./PlanPricing");
const PricingFAQ_1 = require("./PricingFAQ");
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
    header: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "28px",
        lineHeight: "33px",
        marginTop: "40px",
    },
    tableDesktop: {
        fontSize: '16px',
        margin: "10px auto 10px auto",
        mixBlendMode: "normal",
        width: "80%",
        textAlign: "center",
        borderCollapse: "collapse",
        paddingRight: "25px",
    },
    imgBox: {
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
    },
    buttonSignUp: {
        textTransform: "none",
        marginBottom: "8px",
        backgroundColor: "#6754D6",
        width: "9vw",
        height: "45px",
    },
    rowHead: {
        textAlign: "right",
        padding: "7px 0px 7px 20px",
    },
    divider: {
        marginLeft: "4%",
        width: "92%",
    },
    row: {
        height: "55px",
        width: "65%",
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
    subtitle: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "1.2em",
        lineHeight: "1.2em",
        textAlign: "center",
        letterSpacing: "0.15px",
        color: "#E0E0E0",
        paddingBottom: "10%",
    },
});
const TableRowDivider = react_1.default.memo(() => {
    const classes = useStyles();
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", { colSpan: 5 },
            react_1.default.createElement(core_1.Divider, { className: classes.divider }))));
});
const DesktopTable = () => {
    const classes = useStyles();
    const { interval } = PricingStore_1.usePricingStore(['interval']);
    return (react_1.default.createElement(core_1.Paper, { className: classes.tableDesktop },
        react_1.default.createElement("table", null,
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", { style: { height: "100px", verticalAlign: "top" } },
                    react_1.default.createElement("th", { style: { width: "12%" } },
                        react_1.default.createElement("div", { className: "mt-2 mb-2" })),
                    react_1.default.createElement("th", { style: { width: "22%" } },
                        react_1.default.createElement(core_1.Box, { className: classes.header }, "Free"),
                        react_1.default.createElement(core_1.Box, { className: classes.pricing },
                            react_1.default.createElement(PlanPricing_1.PlanPricing, { plan: 'free' }))),
                    react_1.default.createElement("th", { style: { width: "22%" } },
                        react_1.default.createElement(core_1.Box, { className: classes.header }, "Plus"),
                        react_1.default.createElement(core_1.Box, { className: classes.pricing },
                            react_1.default.createElement(PlanPricing_1.PlanPricing, { plan: 'plus' }))),
                    react_1.default.createElement("th", { style: { width: "22%" } },
                        react_1.default.createElement(core_1.Box, { className: classes.header }, "Pro"),
                        react_1.default.createElement(core_1.Box, { className: classes.pricing },
                            react_1.default.createElement(PlanPricing_1.PlanPricing, { plan: 'pro' })))),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(PurchaseOrChangePlanButton_1.PurchaseOrChangePlanButton, { newSubscription: { plan: V2PlanFree, interval } })),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(PurchaseOrChangePlanButton_1.PurchaseOrChangePlanButton, { newSubscription: { plan: V2PlanPlus, interval } })),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(PurchaseOrChangePlanButton_1.PurchaseOrChangePlanButton, { newSubscription: { plan: V2PlanPro, interval } }))),
                react_1.default.createElement(TableRowDivider, null),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHead }, "Storage"),
                    react_1.default.createElement("td", null, "1 GB"),
                    react_1.default.createElement("td", null, "50 GB"),
                    react_1.default.createElement("td", null, "500 GB")),
                react_1.default.createElement(TableRowDivider, null),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHead },
                        "Maximum Captured ",
                        react_1.default.createElement("br", null),
                        " Web Documents"),
                    react_1.default.createElement("td", null, "250"),
                    react_1.default.createElement("td", null, "unlimited"),
                    react_1.default.createElement("td", null, "unlimited")),
                react_1.default.createElement(TableRowDivider, null),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHead }, "Devices"),
                    react_1.default.createElement("td", null, "2"),
                    react_1.default.createElement("td", null, "3"),
                    react_1.default.createElement("td", null, "unlimited")),
                react_1.default.createElement(TableRowDivider, null),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHead }, "Priority Support"),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(MUIFontAwesome_1.FATimesCircleIcon, { className: classes.checkCircle }))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(PlanCheckIcon_1.PlanCheckIcon, null))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(PlanCheckIcon_1.PlanCheckIcon, null)))),
                react_1.default.createElement(TableRowDivider, null),
                react_1.default.createElement("tr", { className: classes.row },
                    react_1.default.createElement("td", { className: classes.rowHead }, "Related Tags"),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(MUIFontAwesome_1.FATimesCircleIcon, { className: classes.checkCircle }))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(PlanCheckIcon_1.PlanCheckIcon, null))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Box, { className: classes.imgBox },
                            react_1.default.createElement(PlanCheckIcon_1.PlanCheckIcon, null)))),
                react_1.default.createElement("tr", { style: { height: "50px" } })))));
};
exports.PricingContentForDesktop = () => {
    return (react_1.default.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column'
        } },
        react_1.default.createElement("div", { style: { margin: '1em auto 1em auto' } },
            react_1.default.createElement("h1", null, "Plans and Pricing")),
        react_1.default.createElement("div", { style: { margin: '1em auto 1em auto' } },
            react_1.default.createElement(PlanIntervalToggle_1.PlanIntervalToggle, null)),
        react_1.default.createElement("div", { style: {} },
            react_1.default.createElement(DesktopTable, null)),
        react_1.default.createElement("div", { className: "ml-auto mr-auto" },
            react_1.default.createElement(PricingFAQ_1.PricingFAQ, null))));
};
//# sourceMappingURL=PricingContentForDesktop.js.map