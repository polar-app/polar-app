import * as React from "react";
import {BlocksUserTagsDB} from "../../../../web/js/datastore/BlocksUserTagsDB";
import {useFirestorePrefs} from "./FirestorePrefs";

export const BlocksUserTagsContext = React.createContext<BlocksUserTagsDB | null>(null);

export const BlocksUserTagsDataLoader: React.FC = React.memo(function UserTagsDataLoader({ children }) {

    const prefs = useFirestorePrefs();

    const userTagsDB = React.useMemo(() => {
        const userTagsDB = new BlocksUserTagsDB(prefs);
        userTagsDB.init();
        return userTagsDB;
    }, [prefs]);

    return (
        <BlocksUserTagsContext.Provider value={userTagsDB}>
            {children}
        </BlocksUserTagsContext.Provider>
    );
});

export function useBlocksUserTagsDB() {
    const blocksUserTagsDB = React.useContext(BlocksUserTagsContext);

    if (! blocksUserTagsDB) {
        throw new Error("useBlocksUserTagsDB must be used within a component that's wrapped in BlocksUserTagsDataLoader");
    }

    return blocksUserTagsDB;
}
