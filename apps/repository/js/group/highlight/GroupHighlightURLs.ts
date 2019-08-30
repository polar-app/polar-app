import {IDStr} from "polar-shared/src/util/Strings";
import {GroupNameStr} from "../../../../../web/js/datastore/sharing/db/Groups";
import {PathToRegexps} from "../../../../../web/js/backend/webserver/PathToRegexps";

export class GroupHighlightURLs {

    public static parse(url: string): GroupHighlightURL {

        const keys: MutableGroupHighlightURL = {};

        const re = PathToRegexps.pathToRegexp('/group/:group/highlight/:id');

        const parsedURL = new URL(url);

        const {pathname} = parsedURL;

        const matches = pathname.match(re);

        if (matches) {
            return {
                name: matches[1],
                id: matches[2],
            };
        }

        return keys;

    }

}

export interface MutableGroupHighlightURL {
    name?: GroupNameStr;
    id?: IDStr;
}


export interface GroupHighlightURL extends Readonly<MutableGroupHighlightURL> {
}

