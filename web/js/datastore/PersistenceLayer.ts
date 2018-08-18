import {Datastore} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {Preconditions} from '../Preconditions';

/**
 * First layer before the raw datastore. At one point we allowed the datastore
 * to perform all the data manipulation / serialization but we ran into problems
 * with node+chrome behaving differently so now we just make node work with raw
 * strings.
 */
export class PersistenceLayer {

    private readonly datastore: Datastore;


    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    async init() {
        await this.datastore.init();
    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {

        let data = await this.datastore.getDocMeta(fingerprint);

        if(!data) {
            return undefined;
        }

        if(! (typeof data === "string")) {
            throw new Error("Expected string and received: " + typeof data);
        }

        return DocMetas.deserialize(data);
    }

    /**
     * Convenience method to not require the fingerprint.
     */
    async syncDocMeta(docMeta: any) {
        return this.sync(docMeta.docInfo.fingerprint, docMeta);
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint: string, docMeta: any) {

        Preconditions.assertNotNull(fingerprint, "fingerprint");
        Preconditions.assertNotNull(docMeta, "docMeta");

        console.log("Sync of docMeta with fingerprint: ", fingerprint);

        if(! (docMeta instanceof DocMeta)) {
            throw new Error("Can not sync anything other than DocMeta.")
        }

        // NOTE that we always write the state with JSON pretty printing.
        // Otherwise tools like git diff , etc will be impossible to deal with
        // in practice.
        let data = DocMetas.serialize(docMeta, "  ");

        await this.datastore.sync(fingerprint, data);

    }

}
