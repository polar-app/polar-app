import {Backend} from "./Backend";
import {FileRef, GetFileOpts} from "./Datastore";
import {DocFileMeta} from "./DocFileMeta";
import {PersistenceLayerProvider} from "./PersistenceLayer";

/**
 * Create resolvers that can lookup doc meta rather than providing a full
 * PersistenceLayer to make it easier for testing.
 */
export class DocFileResolvers {

    public static create(persistenceLayerProvider: PersistenceLayerProvider) {
        return new PersistenceLayerDocFileResolver(persistenceLayerProvider);
    }

}


export interface DocFileResolver {
    resolve(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta;
}

class PersistenceLayerDocFileResolver implements DocFileResolver {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {

    }

    public resolve(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        const persistenceLayer = this.persistenceLayerProvider();
        return persistenceLayer.getFile(backend, ref, opts);
    }

}
