import {Subject} from "rxjs";
import {SnapshotSubscriber} from "polar-shared/src/util/Snapshots";

interface IProps {
    readonly key: string;
    readonly snapshotSubscriber: SnapshotSubscriber<any>;
}

interface ICachedSnapshotContext<V> {

    /**
     * The underlying rxjs observable for sending off updates to components.
     */
    readonly subject: Subject<V>;

    /**
     * The current value, used for the the initial render of each component
     * and to update it each time so that on useObservableStore we can
     * return the current value.
     */
    current: V;

}

export function createCachedSnapshot() {
    return
}