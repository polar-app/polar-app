"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionEvents2 = void 0;
const Numbers_1 = require("polar-shared/src/util/Numbers");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
var SelectionEvents2;
(function (SelectionEvents2) {
    function selectRow(viewID, currentlySelected, view, event, type) {
        const computeStrategy = () => {
            if (type === 'checkbox') {
                return 'toggle';
            }
            if (type === 'click') {
                if (event.getModifierState("Shift")) {
                    return 'range';
                }
                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }
            }
            if (type === 'context') {
                if (currentlySelected.includes(viewID)) {
                    return 'none';
                }
            }
            return 'one';
        };
        const computeStrategy2 = () => {
            if (type === 'checkbox') {
                return 'toggle';
            }
            if (type === 'click') {
                if (event.getModifierState("Shift")) {
                    return 'range';
                }
                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }
            }
            if (type === 'context') {
                if (currentlySelected.includes(viewID)) {
                    return 'none';
                }
            }
            return 'one';
        };
        function computeSelectedIndexes() {
            const viewPageIDs = view.map(current => current.id);
            return currentlySelected.map(current => viewPageIDs.indexOf(current));
        }
        const doStrategyRange = () => {
            let min = 0;
            let max = 0;
            const selected = computeSelectedIndexes();
            const selectedIdx = view.map(current => current.id)
                .indexOf(viewID);
            if (selected.length > 0) {
                const sorted = [...selected].sort((a, b) => a - b);
                min = Arrays_1.Arrays.first(sorted);
                max = Arrays_1.Arrays.last(sorted);
            }
            const rangeMin = Math.min(min, selectedIdx);
            const rangeMax = Math.max(max, selectedIdx);
            const viewPagePointers = [...Numbers_1.Numbers.range(rangeMin, rangeMax)];
            return viewPagePointers.map(ptr => view[ptr].id);
        };
        const doStrategyToggle = () => {
            const selected = computeSelectedIndexes();
            const selectedIdx = view.map(current => current.id)
                .indexOf(viewID);
            function computeViewPagePointers() {
                if (selected.includes(selectedIdx)) {
                    return SetArrays_1.SetArrays.difference(selected, [selectedIdx]);
                }
                else {
                    return SetArrays_1.SetArrays.union(selected, [selectedIdx]);
                }
            }
            const viewPagePointers = computeViewPagePointers();
            return viewPagePointers.map(ptr => view[ptr].id);
        };
        const doStrategyOne = () => {
            return [viewID];
        };
        const doStrategy = () => {
            const strategy = computeStrategy();
            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return currentlySelected;
            }
        };
        return doStrategy();
    }
    SelectionEvents2.selectRow = selectRow;
})(SelectionEvents2 = exports.SelectionEvents2 || (exports.SelectionEvents2 = {}));
//# sourceMappingURL=SelectionEvents2.js.map