import {ErrorType} from "polar-shared/src/util/Errors";
import * as React from "react";
import {createStoreContext} from "./store/StoreContext";
import {ValueStore} from "./ValueStore";

export interface ISnapshotLeft {
    readonly left: ErrorType;
}

export interface ISnapshotRight<S> {
    readonly right: S;
}

/**
 * This provides for three values.
 *
 * - undefined no snapshot yet. This is the initial value because will be
 *   receiving one in the future but we have no value yet.
 */
export type ISnapshot<S> = ISnapshotRight<S> | ISnapshotLeft;

/**
 * Create a snapshot store of a given type that is initially undefined, then a value is provide for us.
 */
export function createSnapshotStore<S>(initialValue: S | undefined) {

    // TODO: we need to take a spinner component while we're waiting for the
    // initial snapshot here because we can't just NOT render anything.  We should
    // use suspense for this I think.

    const [Provider, useStore] = createStoreContext(() => {
        return React.useMemo(() => new ValueStore<S | undefined>(initialValue), []);
    })

    return [Provider, useStore];

}
