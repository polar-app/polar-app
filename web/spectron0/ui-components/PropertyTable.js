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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTable = void 0;
const React = __importStar(require("react"));
class PropertyTable extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("table", { className: "" },
            React.createElement("tbody", null, this.props.children)));
    }
}
exports.PropertyTable = PropertyTable;
PropertyTable.Row = class extends React.Component {
    render() {
        if (this.props.value === undefined) {
            return [];
        }
        const value = Values.toStr(this.props.value);
        return (React.createElement("tr", null,
            React.createElement("td", { className: "font-weight-bold text-grey800 pt-1 pr-1" },
                this.props.name,
                ":"),
            React.createElement("td", { className: "pt-1" },
                React.createElement("div", { style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    } }, value))));
    }
};
PropertyTable.Text = class extends React.Component {
    render() {
        if (this.props.value === undefined) {
            return [];
        }
        const value = Values.toStr(this.props.value);
        return (React.createElement("tr", null,
            React.createElement("td", { colSpan: 2, className: "pt-1" },
                React.createElement("div", { className: "font-weight-bold text-grey800 " },
                    this.props.name,
                    ":"),
                React.createElement("p", null, value))));
    }
};
class Values {
    static toStr(value) {
        if (typeof value === 'string') {
            return value;
        }
        else if (Array.isArray(value)) {
            return value.join(", ");
        }
        else {
            return "";
        }
    }
}
//# sourceMappingURL=PropertyTable.js.map