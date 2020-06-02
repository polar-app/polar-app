import React from "react";
import {SelectRowType} from "./DocRepoScreen";
import {Numbers} from "polar-shared/src/util/Numbers";
import { Arrays } from "polar-shared/src/util/Arrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";

/**
 * Code to allow the user to select multiple items.
 * @Deprecated MUI / FIXME
 */
export namespace SelectionEvents {

    export function selectRow(selectedIdx: number,
                              event: React.MouseEvent,
                              type: SelectRowType,
                              selected: ReadonlyArray<number>) {

        // FIXME the behavior here is basically teh same betweek click and
        // checkbox except unmodified single clicks.  unmodified single clicks
        // toggle the current item for checkbox and focus the selection for
        // click

        selectedIdx = Numbers.toNumber(selectedIdx);

        // there are really only three strategies
        //
        // - one: select ONE item and unselect the previous item(s).  This is done when we have
        //        a single click on an item.  It always selects it and never de-selects it.
        //
        // - add the new selectedIndex to the list of currently selected items.
        //
        //   - FIXME: really what this is is just select-one but we leave the
        //     previous items in place and perform no mutation on them...

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

        type SelectedRows = ReadonlyArray<number>;

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

                if (selected.includes(selectedIdx)) {
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

                if (selected.includes(selectedIdx)) {
                    return 'none';
                }

            }

            return 'one';

        };

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (selected.length > 0) {
                const sorted = [...selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            return [...Numbers.range(Math.min(min, selectedIdx),
                Math.max(max, selectedIdx))];

        };

        const doStrategyToggle = (): SelectedRows => {

            if (selected.includes(selectedIdx)) {
                return SetArrays.difference(selected, [selectedIdx]);
            } else {
                return SetArrays.union(selected, [selectedIdx]);
            }

        };

        const doStrategyOne = (): SelectedRows => {
            return [selectedIdx];
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
                    return selected;
            }

        };

        return doStrategy();

    }
}
