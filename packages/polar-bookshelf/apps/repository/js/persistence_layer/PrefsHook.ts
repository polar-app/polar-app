// yet or throw an Error otherwise.
// import {
//     SubscriptionValue,
//     useSnapshotSubscriber
// } from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
// import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
// import {usePersistenceLayerContext} from "./PersistenceLayerApp";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    SubscriptionValue,
    useSnapshotSubscriber
} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {usePersistenceLayerContext} from "./PersistenceLayerApp";

export function usePrefs(): SubscriptionValue<PersistentPrefs> {

    const persistenceLayerContext = usePersistenceLayerContext();

    const createSubscription = () => {
        const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();

        if (!persistenceLayer) {
            console.warn("No persistence layer");
            return () => NULL_FUNCTION;
        }

        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();

        if (!prefs) {
            throw new Error("No prefs found from datastore: " + datastore.id);
        }

        if (!prefs.subscribe || !prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }

        // FIXME: this will yield bugs I think because the second time it's not
        // used...
        //
        // FIXME: I think this should be constructor and thhat way when
        // it changes, we can reload.

        return prefs.subscribe.bind(prefs);

    }

    return useSnapshotSubscriber(createSubscription());

}
