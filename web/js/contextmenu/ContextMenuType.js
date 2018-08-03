"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContextMenuType;
(function (ContextMenuType) {
    ContextMenuType["DEFAULT"] = "DEFAULT";
    ContextMenuType["PAGEMARK"] = "PAGEMARK";
    ContextMenuType["TEXT_SELECTED"] = "TEXT_SELECTED";
    ContextMenuType["ANNOTATION"] = "ANNOTATION";
    ContextMenuType["TEXT_HIGHLIGHT"] = "TEXT_HIGHLIGHT";
    ContextMenuType["AREA_HIGHLIGHT"] = "AREA_HIGHLIGHT";
    ContextMenuType["PAGE"] = "PAGE";
})(ContextMenuType = exports.ContextMenuType || (exports.ContextMenuType = {}));
class ContextMenuTypes {
    static fromString(val) {
        return ContextMenuType[val];
    }
}
exports.ContextMenuTypes = ContextMenuTypes;
//# sourceMappingURL=ContextMenuType.js.map