"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockSnapshotSubscriber = void 0;
function createMockSnapshotSubscriber() {
    let terminated = false;
    let iter = 0;
    const unsubscriber = () => {
        terminated = true;
    };
    const subscriber = (onNext, onError) => {
        if (!onNext) {
            throw new Error("No onNext function");
        }
        if (terminated) {
            return unsubscriber;
        }
        if (iter > 0) {
            onNext({
                value: iter,
                exists: true,
                source: 'server'
            });
        }
        ++iter;
        setTimeout(() => subscriber(onNext, onError), 1000);
        return unsubscriber;
    };
    return subscriber;
}
exports.createMockSnapshotSubscriber = createMockSnapshotSubscriber;
//# sourceMappingURL=MockSnapshots.js.map