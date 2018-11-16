import {Datastore} from './Datastore';
import {MemoryDatastore} from './MemoryDatastore';
import {DiskDatastore} from './DiskDatastore';
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';

const log = Logger.create();

const ENV_POLAR_DATASTORE = 'POLAR_DATASTORE';

export class Datastores {

    public static create(): Datastore {

        const name = process.env[ENV_POLAR_DATASTORE];

        if (name === 'MEMORY') {
            log.info("Using memory datastore");
            return new MemoryDatastore();
        }

        return new DiskDatastore();

    }

    public static async getDocMetas(datastore: Datastore,
                                    listener: DocMetaListener,
                                    docMetaRefs?: DocMetaRef[]) {

        if (!docMetaRefs) {
            docMetaRefs = await datastore.getDocMetaFiles();
        }

        for (const docMetaRef of docMetaRefs) {
            const docMetaData = await datastore.getDocMeta(docMetaRef.fingerprint);

            if ( ! docMetaData) {
                throw new Error("Could not find docMeta for fingerprint: " + docMetaRef.fingerprint);
            }

            const docMeta = DocMetas.deserialize(docMetaData);
            listener(docMeta);
        }

    }

    /**
     * Remove all the docs in a datastore.  Only do this for testing and for
     * very important use cases.
     */
    public static async purge(datastore: Datastore) {

        const docMetaFiles = await datastore.getDocMetaFiles();

        for (const docMetaFile of docMetaFiles) {

            const data = await datastore.getDocMeta(docMetaFile.fingerprint);
            const docMeta = DocMetas.deserialize(data!);

            datastore.delete({
                fingerprint: docMeta.docInfo.fingerprint,
                docInfo: docMeta.docInfo,
                filename: docMeta.docInfo.filename
            });

        }

    }

}

export type DocMetaListener = (docMeta: DocMeta) => void;
