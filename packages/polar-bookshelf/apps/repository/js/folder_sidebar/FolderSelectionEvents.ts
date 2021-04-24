import React from 'react';
import {IDStr} from "polar-shared/src/util/Strings";
import {SetArrays} from "polar-shared/src/util/SetArrays";

export namespace FolderSelectionEvents {

    /**
     * Event types
     *
     * click: The user has done a regular single left click with no modifiers
     * check: The user has used the checkbox OR click+meta + click+control.
     *        Both function the same way.  We're calling it 'check' because
     *        it functions similar to the checkbox but isn't actually using a
     *        checkbox.
     *
     */
    export type EventType = 'click' | 'check';

    /**
     * The state of the entire state and whether we have multiple, just one, or
     * no items selected.
     */
    export type Selected = 'multiple' | 'single' | 'none';

    /**
     * Whether the current items is selected.
     */
    export type SelfSelected = 'yes' | 'no';

    /**
     * The strategy we should take for mutating the set.
     *
     * put: put the key into the set
     * delete: remove the key from the set
     *
     * put: put the key into the set (union)
     * delete: delete the key from the set
     * replace: replace the set with just this value
     * ignore: take no action...
     */
    export type Strategy = 'put' | 'delete' | 'replace' | 'ignore';

    export type KeyType =
        "click:multiple:yes" |
        "click:multiple:no" |
        "click:single:yes" |
        "click:single:no" |
        // NOTE that this isn't a possible situation
        // "click:none:yes" |
        "click:none:no" |
        "check:multiple:yes" |
        "check:multiple:no" |
        "check:single:yes" |
        "check:single:no" |
        // NOTE that this isn't a possible situation
        // "check:none:yes" |
        "check:none:no"

    export interface FolderSelectionEvent {
        readonly eventType: EventType;
        readonly selected: Selected;
        readonly selfSelected: SelfSelected;
    }

    export function toEventType(event: React.MouseEvent, source: 'checkbox' | 'click') {

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

    /**
     * The way we coded this is a bit more explicit but makes sure there are
     * never any bugs.  We enumerate each possible state and then return a
     * transition function to convert to the next state.
     *
     * Also, this code is going to be easier to debug because I can ask what a
     * user did, find the exact FolderSelectionEvent, and replace it with
     * the correct transition function.
     */
    export function toStrategy(fse: FolderSelectionEvent) {

        const key = toKey(fse);

        switch (key) {

            // ====
            // {"eventType":"click","selected":"multiple","selfSelected":"yes"}
            // key: click:multiple:yes
            case "click:multiple:yes":
                return "replace";

            // ====
            // {"eventType":"click","selected":"multiple","selfSelected":"no"}
            // key: click:multiple:no
            case "click:multiple:no":
                return "replace";

            // ====
            // {"eventType":"click","selected":"single","selfSelected":"yes"}
            // key: click:single:yes
            case "click:single:yes":
                return "ignore";

            // ====
            // {"eventType":"click","selected":"single","selfSelected":"no"}
            // key: click:single:no
            case "click:single:no":
                return "replace";

            // ====
            // {"eventType":"click","selected":"none","selfSelected":"no"}
            // key: click:none:no
            case "click:none:no":
                return "replace";

            // ====
            // {"eventType":"check","selected":"multiple","selfSelected":"yes"}
            // key: check:multiple:yes
            case "check:multiple:yes":
                return "delete";

            // ====
            // {"eventType":"check","selected":"multiple","selfSelected":"no"}
            // key:
            case "check:multiple:no":
                return "put";

            // ====
            // {"eventType":"check","selected":"single","selfSelected":"yes"}
            // key: check:single:yes
            case "check:single:yes":
                return "delete";

            // ====
            // {"eventType":"check","selected":"single","selfSelected":"no"}
            // key: check:single:no
            case "check:single:no":
                return "put";

            // ====
            // {"eventType":"check","selected":"none","selfSelected":"no"}
            // key: check:none:no
            case "check:none:no":
                return "put";

            default:
                throw new Error("Invalid key: " + key);
        }

        // to through each possible scenario and hard code the strategy


    }

    export function executeStrategy(strategy: Strategy,
                                    node: IDStr,
                                    selected: ReadonlyArray<IDStr>): ReadonlyArray<IDStr> {
        switch (strategy) {

            case "put":
                return SetArrays.union(selected, [node]);

            case "delete":
                return SetArrays.difference(selected, [node]);

            case "replace":
                return [node];

            case "ignore":
                return selected;

        }

    }

    function toKey(fse: FolderSelectionEvent): KeyType {
        return <KeyType> `${fse.eventType}:${fse.selected}:${fse.selfSelected}`;
    }

    export function computeOptionsPowerset() {

        const eventTypeOptions: ReadonlyArray<EventType> = ['click', 'check'];
        const selectedOptions: ReadonlyArray<Selected> = ['multiple', 'single', 'none'];
        const selfSelectedOptions: ReadonlyArray<SelfSelected> = ['yes', 'no'];

        for (const eventType of eventTypeOptions) {
            for (const selected of selectedOptions) {
                for (const selfSelected of selfSelectedOptions) {
                    console.log("====");
                    const fse = {eventType, selected, selfSelected};
                    console.log(JSON.stringify(fse, null, ""));
                    console.log("key: " + toKey(fse));
                }
            }
        }

    }

}












