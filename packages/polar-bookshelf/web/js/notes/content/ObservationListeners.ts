import {onBecomeObserved, onBecomeUnobserved} from "mobx";

export namespace ObservationListeners {
    export function watch(target: any, field: string, onObserved: () => void, onUnObserved: () => void) {
        onBecomeObserved(target, field, () => onObserved());
        onBecomeUnobserved(target, field, () => onUnObserved());
    }

}
