import {AppPaths} from '../../electron/webresource/AppPaths';

export class PersistenceLayerWorkers {

    public static create(): Worker {

        let url = AppPaths.resourceURLFromRelativeURL("./web/js/datastore/dispatcher/PersistenceLayerWorker.js")

        return new Worker(url);
    }

}
