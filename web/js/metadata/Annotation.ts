import {VersionedObject} from './VersionedObject';

export abstract class Annotation extends VersionedObject {

    protected constructor(val: Annotation) {

        super(val);

        this.init(val);

    }

}
