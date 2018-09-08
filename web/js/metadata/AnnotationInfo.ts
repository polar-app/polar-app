import {SerializedObject} from './SerializedObject';
import {ISODateTimeString} from './ISODateTimeStrings';

/**
 * High level information about the annotations in this document.
 *
 */
export class AnnotationInfo extends SerializedObject {

    /**
     * The last time this document was annotated (pagemarks updated, text
     * updated, etc).
     */
    public lastAnnotated?: ISODateTimeString;

    constructor(val: AnnotationInfo) {

        super(val);

        this.lastAnnotated = val.lastAnnotated;

        this.init(val);

    }

    public validate() {
        super.validate();
    }

}
