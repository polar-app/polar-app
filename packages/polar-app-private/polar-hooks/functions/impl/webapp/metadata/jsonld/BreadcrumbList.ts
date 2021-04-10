import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IListItem} from "./ListItem";

export interface IBreadcrumbList {
    readonly itemListElement: ReadonlyArray<IListItem>;
}

export class BreadcrumbLists {

    public static create(itemListElement: ReadonlyArray<IListItem>): IBreadcrumbList {

        return Dictionaries.onlyDefinedProperties({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement
        });

    }

}
