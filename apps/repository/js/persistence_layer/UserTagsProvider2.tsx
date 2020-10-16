import * as React from "react";
import {UserTag, UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {ITagsContext, TagsContext} from "./PersistenceLayerApp";
import {SubscriptionValue} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {usePrefs} from "./PrefsHook";

// TODO: instead of a SubscriptionValue just return undefined if it's not set

export function useUserTags(): SubscriptionValue<ReadonlyArray<UserTag>> {

    const {value, error} = usePrefs();

    if (value) {
        const userTagsDB = new UserTagsDB(value);
        userTagsDB.init();
        return {
            value: userTagsDB.tags(),
            error: undefined
        };
    }

    return {value: undefined, error};

}

interface IProps {
    readonly children: React.ReactElement;
}


export const UserTagsProvider = React.memo((props: IProps) => {

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
