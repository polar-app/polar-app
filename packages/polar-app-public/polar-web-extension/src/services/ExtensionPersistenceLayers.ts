import {FirebaseDatastore} from "polar-bookshelf/web/js/datastore/FirebaseDatastore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DefaultPersistenceLayer} from "polar-bookshelf/web/js/datastore/DefaultPersistenceLayer";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export namespace ExtensionPersistenceLayers {

    export async function create() {
        await FirestoreBrowserClient.init({enablePersistence: false});
        const datastore = new FirebaseDatastore()
        // TODO add back in the error listener I think.
        await datastore.init(NULL_FUNCTION, {noInitialSnapshot: true, noSync: true});
        return new DefaultPersistenceLayer(datastore);
    }

}
