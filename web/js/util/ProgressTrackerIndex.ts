import {Progress, ProgressTracker, Percentage} from "./ProgressTracker";
import {Reducers} from './Reducers';
import {isPresent} from '../Preconditions';

export class ProgressTrackerIndex {

    private index: { [key: number]: Progress } = {};

    public update(progress: Progress) {

        if (! isPresent(progress.progress)) {
            return;
        }

        if (progress.progress === 100) {
            delete this.index[progress.task];
        } else {
            this.index[progress.task] = progress;
        }

    }

    public min(defaultValue: number = 100): number {

        if (Object.keys(this.index).length === 0) {
            // no entries so we're done.
            return defaultValue;
        }

        const percs = Object.values(this.index)
            .map(current => current.progress);

        return Math.min(...percs);

    }

}


