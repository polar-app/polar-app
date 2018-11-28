import {Percentage, ProgressState} from './ProgressTracker';

export class ProgressTrackers {

    public static completed(total: number = 1): ProgressState {

        return {
            completed: 1,
            total: 1,
            duration: 0,
            progress: 100,
        };

    }

}
