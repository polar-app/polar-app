import * as React from "react";
import {Tag} from "polar-shared/src/tags/Tags";
import {UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {usePrefsContext} from "./PrefsContext2";

export type UserTags = ReadonlyArray<Tag>;

export const UserTagsContext = React.createContext<UserTagsDB | null>(null);

export const UserTagsDataLoader: React.FC = React.memo(function UserTagsDataLoader({ children }) {

    const prefs = usePrefsContext();

    const userTagsDB = React.useMemo(() => {
        const userTagsDB = new UserTagsDB(prefs);
        userTagsDB.init();
        return userTagsDB;
    }, [prefs]);

    return (
        <UserTagsContext.Provider value={userTagsDB}>
            {children}
        </UserTagsContext.Provider>
    );
});

export function useUserTagsDB() {
    const userTagsDB = React.useContext(UserTagsContext)

    if (!userTagsDB) {
        throw new Error("useUserTagsDB must be used within a component that's wrapped in UserTagsDataLoader");
    }

    return userTagsDB;
}
