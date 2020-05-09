import {BaseType} from "./BaseType";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

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
