import {VersionedObject} from './VersionedObject';

export abstract class Annotation extends VersionedObject {

    protected constructor(val: Partial<Annotation>) {

        super(val);

        this.init(val);

    }

}
