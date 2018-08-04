import {SerializedObject} from './SerializedObject';

export class Author extends SerializedObject {

    /**
     * The name of this author.
     */
    public name: string = "";

    constructor(val: any) {
        super(val);

    }

}
