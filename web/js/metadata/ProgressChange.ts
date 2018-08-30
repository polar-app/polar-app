import {ISODateTime} from './ISODateTime';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

/**
 * Used so that we can track the history of the document as we're reading it
 * so that we can keep a burn-down chart of our reading rate.
 */
export class ProgressChange extends SerializedObject {

    readonly id: string;

    readonly changed: ISODateTime;

    /**
     * Percentage of how complete we are on the document at the given change
     * timestamp.
     */
    readonly percentage: number;

    constructor(obj: any) {
        super(obj);

        this.id = obj.id;
        this.changed = obj.changed;
        this.percentage = obj.percentage;

    }

    setup() {

        super.setup();

    }

    validate() {

        super.validate();

        Preconditions.assertPresent(this.id);
        Preconditions.assertPresent(this.changed);
        Preconditions.assertPresent(this.percentage);

    }

}

