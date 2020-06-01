// import * as React from "react";
// import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
// import {Tag} from "polar-shared/src/tags/Tags";
// import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
// import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
// import {SnapshotSubscriber} from "../../../../web/js/firebase/SnapshotSubscribers";
// import {UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";
// import {DataSubscribers} from "../../../../web/js/ui/data_loader/DataSubscribers";
// import {ITags, usePersistenceLayer} from "./PersistenceLayerApp";
//
//
// function createSubscriber(persistenceLayerProvider: PersistenceLayerProvider): SnapshotSubscriber<ITags> {
//
//     const persistenceLayer = persistenceLayerProvider();
//
//     const datastore = persistenceLayer.datastore;
//     const prefs = datastore.getPrefs();
//
//     if (! prefs) {
//         throw new Error("No prefs found from datastore: " + datastore.id);
//     }
//
//     if (! prefs.subscribe || ! prefs.get) {
//         throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
//     }
//
//     return () => {
//
//         if (persistentPrefs) {
//
//             const userTagsDB = new UserTagsDB(persistentPrefs);
//             userTagsDB.init();
//             const userTags = userTagsDB.tags();
//
//             return this.props.render(userTags);
//
//         } else {
//             return this.props.render(undefined);
//         }
//
//
//     }
//
// }
//
//
// const [Provider, Context] = DataSubscribers.create()
//
// export interface IProps {
//     readonly children: React.ReactElement;
// }
//
// export type UserTags = ReadonlyArray<Tag>;
//
// export const UserTagsProvider = React.memo((props: IProps) => {
//
//     const persistenceLayer = usePersistenceLayer();
//
//     const subscriber = React.useMemo(() => {
//
//     });
//
//
//
//         const render = (persistentPrefs: PersistentPrefs | undefined) => {
//
//
//         };
//
//         const provider: SnapshotSubscriber<PersistentPrefs> = (onNext, onError) => prefs.subscribe(onNext, onError);
//
//         return (
//             <DataLoader id="userTags" provider={provider} render={prefs => render(prefs)}/>
//         );
//
//     }
//
// }
