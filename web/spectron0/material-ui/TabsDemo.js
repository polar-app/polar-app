"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const useStyles = styles_1.makeStyles({
    root: {},
});
function TabsDemo() {
    const classes = useStyles();
    const [value, setValue] = react_1.default.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (react_1.default.createElement(Tabs_1.default, { value: value, onChange: handleChange, indicatorColor: "primary", textColor: "primary" },
        react_1.default.createElement(Tab_1.default, { label: "Documents" }),
        react_1.default.createElement(Tab_1.default, { label: "Notes" }),
        react_1.default.createElement(Tab_1.default, { label: "Statistics" })));
}
exports.default = TabsDemo;
//# sourceMappingURL=TabsDemo.js.map