import {VersionedObject} from './VersionedObject';
import {IVersionedObject} from "./IVersionedObject";

export abstract class Annotation extends VersionedObject implements IAnnotation {

    protected constructor(val: Annotation) {

        super(val);

        this.init(val);

    }

}

export interface IAnnotation extends IVersionedObject {

}
