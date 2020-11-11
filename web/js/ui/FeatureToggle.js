"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureToggle = void 0;
const react_1 = __importDefault(require("react"));
const FeatureToggles_1 = require("polar-shared/src/util/FeatureToggles");
class FeatureToggle extends react_1.default.Component {
    render() {
        if (FeatureToggles_1.FeatureToggles.get(this.props.name)) {
            return this.props.children;
        }
        return [];
    }
}
exports.FeatureToggle = FeatureToggle;
//# sourceMappingURL=FeatureToggle.js.map