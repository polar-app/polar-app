import {SerializedObject} from './SerializedObject';
import {URLStr} from "../util/Strings";
import {ProfileIDStr} from "../datastore/sharing/db/Profiles";

export class Author extends SerializedObject {

    /**
     * The name of this author.
     */
    public readonly name: string = "";

    public readonly profileID: ProfileIDStr;

    /**
     * The URL to this author's profile.
     */
    public readonly url?: string;

    public readonly image?: AuthorImage;

    constructor(val: IAuthor) {
        super(<any> val);
        this.name = val.name;
        this.profileID = val.profileID;
        this.url = val.url;
        this.image = val.image;
    }

}

export interface AuthorImage {
    readonly src: URLStr;
}

export interface IAuthor {

    readonly name: string;

    readonly profileID: ProfileIDStr;

    /**
     * The URL to this author's profile.
     */
    readonly url?: string;

    readonly image?: AuthorImage;

}
