import {VersionedObject} from './VersionedObject';
import {IAnnotation} from "./IAnnotation";

export abstract class Annotation extends VersionedObject implements IAnnotation {

    protected constructor(val: Annotation) {

        super(val);

        this.init(val);

    }

}

