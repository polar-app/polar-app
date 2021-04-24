import * as React from "react";
import {UserTag, UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {ITagsContext, TagsContext} from "./PersistenceLayerApp";
import {SubscriptionValue} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {usePrefsContext} from "./PrefsContext2";

function useUserTags(): SubscriptionValue<ReadonlyArray<UserTag>> {

    const prefs = usePrefsContext();

    const userTagsDB = new UserTagsDB(prefs);
    userTagsDB.init();

    return {
        value: userTagsDB.tags(),
        error: undefined
    };

}

interface IProps {
    readonly children: React.ReactElement;
}

// TODO: this can be cached easier...
export const UserTagsProvider = React.memo(function UserTagsProvider(props: IProps) {

    const userTagsRef = React.useRef<SubscriptionValue<ReadonlyArray<UserTag>>>({value: [], error: undefined});

    userTagsRef.current = useUserTags();

    const tagsProvider = React.useMemo(() => () => userTagsRef.current.value || [], []);

    const context: ITagsContext = React.useMemo(() => {
        return {tagsProvider}
    }, [tagsProvider]);

    return (
        <TagsContext.Provider value={context}>
            {props.children}
        </TagsContext.Provider>
    );

});
