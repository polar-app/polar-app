import * as React from "react";
import {DataLoader} from "../../../web/js/ui/data_loader/DataLoader";
import {Tag} from "polar-shared/src/tags/Tags";
import {PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {PersistentPrefs} from "../../../web/js/util/prefs/Prefs";
import {DatastoreUserTags} from "../../../web/js/datastore/DatastoreUserTags";

export class UserTagsDataLoader extends React.Component<IProps, IState> {

    public render() {

        const persistenceLayer = this.props.persistenceLayerProvider();

        if (! persistenceLayer) {
            // FIXME: we dont have one on start and then it CHANGES on us over time!
            return null;
        }

        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();

        if (! prefs.subscribe) {
            throw new Error("Prefs is missing subscribe function from datastore: " + datastore.id);
        }

        const render = (prefs: PersistentPrefs | undefined) => {

            if (prefs) {

                const userTags = DatastoreUserTags.get(prefs);
                return this.props.render(userTags);

            } else {
                return this.props.render(undefined);
            }

        };

        return (
            <DataLoader provider={prefs.subscribe}
                        render={prefs => render(prefs)}/>
        );

        return null;

    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly render: (userTags: ReadonlyArray<Tag> | undefined) => React.ReactElement;
}

interface IState {

}
