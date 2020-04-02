import * as React from "react";
import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
import {Tag} from "polar-shared/src/tags/Tags";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {SnapshotSubscriber} from "../../../../web/js/firebase/SnapshotSubscribers";
import {UserTagsDB} from "../../../../web/js/datastore/UserTagsDB";

export class UserTagsDataLoader extends React.Component<IProps, IState> {

    public render() {

        const persistenceLayer = this.props.persistenceLayerProvider();

        if (! persistenceLayer) {
            return null;
        }

        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();

        if (! prefs) {
            throw new Error("No prefs found from datastore: " + datastore.id);
        }

        if (! prefs.subscribe || ! prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }

        const render = (persistentPrefs: PersistentPrefs | undefined) => {

            if (persistentPrefs) {

                const userTagsDB = new UserTagsDB(persistentPrefs);
                userTagsDB.init();
                const userTags = userTagsDB.tags();

                // console.log("UserTags: ", userTags.sort((a, b) => a.id.localeCompare(b.id)));

                return this.props.render(userTags);

            } else {
                return this.props.render(undefined);
            }

        };

        const provider: SnapshotSubscriber<PersistentPrefs> = (onNext, onError) => prefs.subscribe(onNext, onError);

        return (
            <DataLoader id="userTags" provider={provider} render={prefs => render(prefs)}/>
        );

    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly render: (userTags: ReadonlyArray<Tag> | undefined) => React.ReactElement;
}

interface IState {

}

export type UserTags = ReadonlyArray<Tag>;
