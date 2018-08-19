import {ISODateTime} from './ISODateTime';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

/**
 * High level information about the annotations in this document.
 *
 */
export class AnnotationInfo extends SerializedObject {

    /**
     * The last time this document was annotated (pagemarks updated, text
     * updated, etc).
     */
    public lastAnnotated?: ISODateTime;

    constructor(val: AnnotationInfo) {

        super(val);

        this.lastAnnotated = val.lastAnnotated;

        this.init(val);

    }


    validate() {
        super.validate();
    }

}
