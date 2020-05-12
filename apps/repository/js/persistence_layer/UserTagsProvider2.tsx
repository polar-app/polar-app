import * as React from "react";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {UserTag, UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {ITags, TagsContext, usePersistenceLayer} from "./PersistenceLayerApp";
import {
    SubscriptionValue,
    useSubscription
} from "../../../../web/js/ui/data_loader/UseSubscription";

export function usePrefs(): SubscriptionValue<PersistentPrefs> {

    const persistenceLayerContext = usePersistenceLayer();

    const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();

    if (! persistenceLayer) {
        return {value: undefined, error: undefined};
    }

    const datastore = persistenceLayer.datastore;
    const prefs = datastore.getPrefs();

    if (! prefs) {
        throw new Error("No prefs found from datastore: " + datastore.id);
    }

    if (! prefs.subscribe || ! prefs.get) {
        throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
    }

    return useSubscription(prefs.subscribe.bind(prefs));

};

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
    const context: ITags = React.useMemo(() => {
        return {tagsProvider}
    }, []);

    return (
        <TagsContext.Provider value={context}>
            {props.children}
        </TagsContext.Provider>
    );

});
