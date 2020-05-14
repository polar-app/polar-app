import * as React from "react";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {UserTag, UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
import {ITagsContext, TagsContext, usePersistenceLayerContext} from "./PersistenceLayerApp";
import {
    SubscriptionValue,
    useSubscription
} from "../../../../web/js/ui/data_loader/UseSubscription";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export function usePrefs(): SubscriptionValue<PersistentPrefs> {

    const persistenceLayerContext = usePersistenceLayerContext();

    const createSubscription = () => {
        const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();

        if (! persistenceLayer) {
            return () => NULL_FUNCTION;
        }

        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();

        if (! prefs) {
            throw new Error("No prefs found from datastore: " + datastore.id);
        }

        if (! prefs.subscribe || ! prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }

        // FIXME: this will yield bugs I think because the second time its' not
        //  used...  FIXME: I think this should be constructor and thhat way when
        // it changes, we can reload.

        return prefs.subscribe.bind(prefs);

    }

    return useSubscription(createSubscription());

}

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
    }, []);

    return (
        <TagsContext.Provider value={context}>
            {props.children}
        </TagsContext.Provider>
    );

});
