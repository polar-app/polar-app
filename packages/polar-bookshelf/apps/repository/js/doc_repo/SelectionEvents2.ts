import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {IDStr} from "polar-shared/src/util/Strings";
import {IMouseEvent} from "./MUIContextMenu2";

/**
 * The type of event that triggered the row selection.  Either a normal click, a context menu click (right click) or
 * a checkbox for selecting multiple.
 */
export type SelectRowType = 'click' | 'context' | 'checkbox';

interface IDType {
    readonly id: IDStr;
}

export type SelectedRows = ReadonlyArray<IDStr>;

/**
 * Code to allow the user to select multiple items where with an array of items
 * which have IDs and a viewPage of items that have IDs.
 */
export namespace SelectionEvents2 {

    export function selectRow<T extends IDType>(viewID: IDStr,
                                                currentlySelected: ReadonlyArray<IDStr>,
                                                view: ReadonlyArray<T>,
                                                event: IMouseEvent,
                                                type: SelectRowType): SelectedRows {

        // there are really only three strategies
        //
        // - one: select ONE item and unselect the previous item(s).  This is done when we have
        //        a single click on an item.  It always selects it and never de-selects it.
        //
        // - add the new selectedIndex to the list of currently selected items.
        //
        // - toggle: used when the type is 'checkbox' because we're only toggling
        //   the selection of that one item
        //
        // - none: do nothing.  this is used when the context menu is being used and no additional
        //         items are being changed.

        // modifier:
        //
        //    - shift: shift key
        //    - control: control or meta key (Apple key on MacOS)
        //
        //    - type:
        //         - click
        //         - context
        //         -

        //    type    |  modifier |
        // |----------|-----------|
        // | checkbox |  shift    |

        type SelectionStrategy = 'one' | 'range' | 'toggle' | 'none';

        const computeStrategy = (): SelectionStrategy => {

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

        const computeStrategy2 = (): SelectionStrategy => {

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

        function computeSelectedIndexes(): ReadonlyArray<number> {
            const viewPageIDs = view.map(current => current.id);
            return currentlySelected.map(current => viewPageIDs.indexOf(current));
        }

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            const selected = computeSelectedIndexes();

            const selectedIdx = view.map(current => current.id)
                                        .indexOf(viewID);

            if (selected.length > 0) {
                const sorted = [...selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            const rangeMin = Math.min(min, selectedIdx);
            const rangeMax = Math.max(max, selectedIdx);

            const viewPagePointers = [...Numbers.range(rangeMin, rangeMax)];

            // now convert these back to IDs
            return viewPagePointers.map(ptr => view[ptr].id);

        };

        const doStrategyToggle = (): SelectedRows => {

            const selected = computeSelectedIndexes();

            const selectedIdx = view.map(current => current.id)
                                        .indexOf(viewID);

            function computeViewPagePointers() {
                if (selected.includes(selectedIdx)) {
                    return SetArrays.difference(selected, [selectedIdx]);
                } else {
                    return SetArrays.union(selected, [selectedIdx]);
                }
            }

            const viewPagePointers = computeViewPagePointers();
            // now convert these back to IDs
            return viewPagePointers.map(ptr => view[ptr].id);

        };

        const doStrategyOne = (): SelectedRows => {
            return [viewID];
        };

        const doStrategy = (): SelectedRows => {

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
}
