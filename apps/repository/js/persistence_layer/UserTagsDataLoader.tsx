import * as React from "react";
import {Tag} from "polar-shared/src/tags/Tags";
import {UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {usePrefsContext} from "./PrefsContext2";

export type UserTags = ReadonlyArray<Tag>;

export interface IProps {
    readonly render: (userTags: ReadonlyArray<Tag> | undefined) => React.ReactElement;
}

export const UserTagsDataLoader = React.memo((props: IProps) => {

    const prefs = usePrefsContext();

    if (! prefs) {
        throw new Error("No prefs");
    }

    const userTagsDB = new UserTagsDB(prefs);
    userTagsDB.init();
    const userTags = userTagsDB.tags();

    return props.render(userTags);

})

