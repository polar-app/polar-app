"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderSelectionEvents = void 0;
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
var FolderSelectionEvents;
(function (FolderSelectionEvents) {
    function toEventType(event, source) {
        switch (source) {
            case "checkbox":
                return 'check';
            case "click":
                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'check';
                }
                return 'click';
        }
    }
    FolderSelectionEvents.toEventType = toEventType;
    function toStrategy(fse) {
        const key = toKey(fse);
        switch (key) {
            case "click:multiple:yes":
                return "replace";
            case "click:multiple:no":
                return "replace";
            case "click:single:yes":
                return "ignore";
            case "click:single:no":
                return "replace";
            case "click:none:no":
                return "replace";
            case "check:multiple:yes":
                return "delete";
            case "check:multiple:no":
                return "put";
            case "check:single:yes":
                return "delete";
            case "check:single:no":
                return "put";
            case "check:none:no":
                return "put";
            default:
                throw new Error("Invalid key: " + key);
        }
    }
    FolderSelectionEvents.toStrategy = toStrategy;
    function executeStrategy(strategy, node, selected) {
        switch (strategy) {
            case "put":
                return SetArrays_1.SetArrays.union(selected, [node]);
            case "delete":
                return SetArrays_1.SetArrays.difference(selected, [node]);
            case "replace":
                return [node];
            case "ignore":
                return selected;
        }
    }
    FolderSelectionEvents.executeStrategy = executeStrategy;
    function toKey(fse) {
        return `${fse.eventType}:${fse.selected}:${fse.selfSelected}`;
    }
    function computeOptionsPowerset() {
        const eventTypeOptions = ['click', 'check'];
        const selectedOptions = ['multiple', 'single', 'none'];
        const selfSelectedOptions = ['yes', 'no'];
        for (const eventType of eventTypeOptions) {
            for (const selected of selectedOptions) {
                for (const selfSelected of selfSelectedOptions) {
                    console.log("====");
                    const fse = { eventType, selected, selfSelected };
                    console.log(JSON.stringify(fse, null, ""));
                    console.log("key: " + toKey(fse));
                }
            }
        }
    }
    FolderSelectionEvents.computeOptionsPowerset = computeOptionsPowerset;
})(FolderSelectionEvents = exports.FolderSelectionEvents || (exports.FolderSelectionEvents = {}));
//# sourceMappingURL=FolderSelectionEvents.js.map