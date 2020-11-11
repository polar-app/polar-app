"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRoot = void 0;
const react_1 = __importDefault(require("react"));
const TwoMigrationForElectron_1 = require("../../../../apps/repository/js/gateways/two_migration/TwoMigrationForElectron");
exports.RepositoryRoot = react_1.default.memo((props) => {
    return (react_1.default.createElement(TwoMigrationForElectron_1.TwoMigrationForElectron, null, props.children));
});
//# sourceMappingURL=RepositoryRoot.js.map