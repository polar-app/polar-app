import {IVersionedObject, VersionedObject} from './VersionedObject';

export abstract class Annotation extends VersionedObject implements IAnnotation {

    protected constructor(val: Annotation) {

        super(val);

        this.init(val);

    }

}

export interface IAnnotation extends IVersionedObject {

}
