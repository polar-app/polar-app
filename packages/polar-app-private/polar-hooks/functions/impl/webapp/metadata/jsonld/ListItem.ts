import {BaseType} from "./BaseType";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Profile} from "../../../groups/db/Profiles";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IImageObject, ImageObjects} from "./ImageObject";
import {URLStr} from "polar-shared/src/util/Strings";

export interface IListItemInit {

    readonly name: string;
    readonly position: number;
    readonly item: string;

}

export interface IListItem extends IListItemInit, BaseType {


}

export class ListItems {

    public static create(init: IListItemInit): IListItem {

        return Dictionaries.onlyDefinedProperties({
            "@type": "ListItem",
            ...init
        });

    }

}
