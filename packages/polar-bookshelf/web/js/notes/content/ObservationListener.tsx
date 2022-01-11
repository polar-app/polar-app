import {makeObservable, onBecomeObserved, onBecomeUnobserved} from "mobx";

export class ObservationListener {

    constructor(onObserved: () => void, onUnObserved: () => void) {
        makeObservable(this);
        onBecomeObserved(this, "temperature", () => onObserved())
        onBecomeUnobserved(this, "temperature", () => onUnObserved())
    }

}
