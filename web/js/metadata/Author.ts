import {SerializedObject} from './SerializedObject';
import {URLStr} from "../util/Strings";
import {ProfileIDStr} from "../datastore/sharing/db/Profiles";

export class Author extends SerializedObject {

    public readonly name: string = "";

    public readonly profileID: ProfileIDStr;

    public readonly url?: string;

    public readonly image?: AuthorImage;

    // FIXME: I don't like this so we should find an alternative way to
    //  represent this....
    public readonly guest?: boolean;

    constructor(val: IAuthor) {
        super(<any> val);
        this.name = val.name;
        this.profileID = val.profileID;
        this.url = val.url;
        this.image = val.image;
        this.guest = val.guest;
    }

}

export interface AuthorImage {
    readonly src: URLStr;
}

export interface IAuthor {

    /**
     * The name of this author.
     */
    readonly name: string;

    readonly profileID: ProfileIDStr;

    /**
     * The URL to this author's profile.
     */
    readonly url?: string;

    readonly image?: AuthorImage;

    /**
     * True if we're viewing this document as a guest and aren't the primary
     * owner which means we can't mutate it directly.
     */
    readonly guest?: boolean;

}
