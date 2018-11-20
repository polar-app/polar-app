import {Datastore, FileRef} from './Datastore';
import {MemoryDatastore} from './MemoryDatastore';
import {DiskDatastore} from './DiskDatastore';
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {NULL_FUNCTION} from '../util/Functions';
import {Percentages} from '../util/Percentages';

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
    public static async purge(datastore: Datastore,
                              purgeListener: PurgeListener = NULL_FUNCTION) {

        const docMetaFiles = await datastore.getDocMetaFiles();

        let completed: number = 0;
        const total: number = docMetaFiles.length;

        // TODO: would be more ideal for this to use an AsyncWorkQueue

        for (const docMetaFile of docMetaFiles) {

            const data = await datastore.getDocMeta(docMetaFile.fingerprint);
            const docMeta = DocMetas.deserialize(data!);

            const docFile: FileRef = {
                name: docMeta.docInfo.filename!,
                hashcode: docMeta.docInfo.hashcode
            };

            datastore.delete({
                fingerprint: docMeta.docInfo.fingerprint,
                docInfo: docMeta.docInfo,
                docFile
            });

            ++completed;

            const progress = Percentages.calculate(completed, total);

            purgeListener({completed, total, progress});

        }

        if (total === 0) {
            purgeListener({completed, total, progress: 100});
        }

    }

}

export type DocMetaListener = (docMeta: DocMeta) => void;

export interface PurgeEvent {
    readonly completed: number;
    readonly total: number;
    readonly progress: number;
}

export type PurgeListener = (purgeEvent: PurgeEvent) => void;
