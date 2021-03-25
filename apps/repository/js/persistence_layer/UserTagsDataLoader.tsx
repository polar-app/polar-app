import * as React from "react";
import {Tag} from "polar-shared/src/tags/Tags";
import {UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {usePrefsContext} from "./PrefsContext2";

export type UserTags = ReadonlyArray<Tag>;

export interface IProps {
    readonly Component: React.FunctionComponent<{userTags: ReadonlyArray<Tag> | undefined}>;
}

export const UserTagsDataLoader = React.memo(function UserTagsDataLoader(props: IProps) {

    const prefs = usePrefsContext();

    const userTags = React.useMemo(() => {
        const userTagsDB = new UserTagsDB(prefs);
        userTagsDB.init();
        return userTagsDB.tags();
    }, [prefs]);

    return props.Component({userTags});

})

export function useUserTagsDB() {

    const prefs = usePrefsContext();

    const userTagsDB = new UserTagsDB(prefs);
    userTagsDB.init();

    return userTagsDB;

}
