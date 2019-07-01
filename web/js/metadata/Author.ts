import {SerializedObject} from './SerializedObject';
import {URLStr} from "../util/Strings";

export class Author extends SerializedObject {

    /**
     * The name of this author.
     */
    public name: string = "";

    /**
     * The URL to this author's profile.
     */
    public url?: string;

    public image?: AuthorImage;

    constructor(val: IAuthor) {
        super(<any> val);
    }

}

export interface AuthorImage {
    readonly src: URLStr;
}

export interface IAuthor {

    readonly name: string;

    /**
     * The URL to this author's profile.
     */
    readonly url?: string;

    readonly image?: AuthorImage;

}
