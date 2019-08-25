import {GroupNameStr} from "../../../../web/js/datastore/sharing/db/Groups";

export class GroupURLs {

    public static parse(url: string): GroupURL {

        const regex = /\/group\/([^/]+)/;
        const matches = url.match(regex);
        if (matches && matches[1]) {
            const name = matches[1];
            return {name}
        }

        throw new Error("No group name");

    }

}

export interface GroupURL {
    readonly name: GroupNameStr;
}
