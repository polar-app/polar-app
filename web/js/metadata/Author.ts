import {SerializedObject} from './SerializedObject';

export class Author extends SerializedObject {

    /**
     * The name of this author.
     */
    public name: string = "";

    // TODO: include a link here and the name should not be optional.  If the
    // author doesn't have a link metadata we're missing a major piece of
    // metadata.

    constructor(val: any) {
        super(val);

    }

}
