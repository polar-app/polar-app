import {Datastore} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {Preconditions} from '../Preconditions';
import {ISODateTimes} from '../metadata/ISODateTimes';
import {Logger} from '../logger/Logger';
import {ISODateTime} from '../metadata/ISODateTime';

const log = Logger.create();

/**
 * First layer before the raw datastore. At one point we allowed the datastore
 * to perform all the data manipulation / serialization but we ran into problems
 * with node+chrome behaving differently so now we just make node work with raw
 * strings.
 */
export class PersistenceLayer implements IPersistenceLayer {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly datastore: Datastore;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
        this.stashDir = this.datastore.stashDir;
        this.logsDir = this.datastore.logsDir;
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
    async syncDocMeta(docMeta: DocMeta) {
        return this.sync(docMeta.docInfo.fingerprint, docMeta);
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint: string, docMeta: DocMeta) {

        Preconditions.assertNotNull(fingerprint, "fingerprint");
        Preconditions.assertNotNull(docMeta, "docMeta");

        // create a copy of docMeta so we can mutate it without the risk of
        // firing event listeners via proxies and then we can update the
        // lastUpdated time.  We're also going to have to fire and advertisement
        // that it's been updated.
        docMeta = Object.assign(Object.create(docMeta), docMeta);
        docMeta.docInfo.lastUpdated = ISODateTimes.create();

        if(docMeta.docInfo.added === undefined) {
            docMeta.docInfo.added = new ISODateTime(new Date());
        }

        log.info("Sync of docMeta with fingerprint: ", fingerprint);

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

export interface IPersistenceLayer {

    readonly stashDir: string;

    readonly logsDir: string;

    init(): Promise<void>;
    getDocMeta(fingerprint: string): Promise<DocMeta | undefined>;
    syncDocMeta(docMeta: DocMeta): Promise<void>;
    sync(fingerprint: string, docMeta: DocMeta): Promise<void>;

}
