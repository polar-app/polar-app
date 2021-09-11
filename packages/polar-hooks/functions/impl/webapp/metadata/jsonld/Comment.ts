import {BaseType, BaseTypeInit} from "./BaseType";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPerson} from "./Person";
import {GraphEntry} from "./Graph";

export interface ICommentInit extends BaseTypeInit {

    readonly text: string;

    readonly author?: IPerson;

    readonly dateCreated?: ISODateTimeString;

}

export interface ICommentGraphEntryInit extends GraphEntry, ICommentInit {

}

export interface IComment extends ICommentInit, BaseType {


}

export class Comments {

    public static create(init: ICommentInit | ICommentGraphEntryInit): IComment {

        return {
            "@type": "Comment",
            ...init
        };

    }

}
