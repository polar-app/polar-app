import {IPersistenceLayer} from "./IPersistenceLayer";
import {NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {Backend} from './Backend';
import {Blobs} from "../util/Blobs";
import {ArrayBuffers} from "../util/ArrayBuffers";
import {AsyncFunction, AsyncWorkQueue} from '../util/AsyncWorkQueue';
import {DocMetaRef} from "./DocMetaRef";

export class PersistenceLayers {

    public static async transfer(source: IPersistenceLayer,
                                 target: IPersistenceLayer,
                                 listener: (transferEvent: TransferEvent) => void = NULL_FUNCTION) {

        const docMetaFiles = await source.getDocMetaFiles();

        const before = Date.now();
        const total = docMetaFiles.length;
        let completed = 0;

        const asyncWorkQueue = new AsyncWorkQueue([]);

        async function handleStashFile(filename: string) {

            if (! target.containsFile(Backend.STASH, filename)) {

                const optionalFile = await source.getFile(Backend.STASH, filename);

                if (optionalFile.isPresent()) {
                    const file = optionalFile.get();
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    const arrayBuffer = await Blobs.toArrayBuffer(blob);
                    const buffer = ArrayBuffers.toBuffer(arrayBuffer);

                    target.writeFile(file.backend, file.name, buffer, file.meta);
                }

            }

        }

        async function handleDocMetaFile(docMetaFile: DocMetaRef) {

            console.log("Working with fingerprint: " + docMetaFile.fingerprint);

            const docMeta = await source.getDocMeta(docMetaFile.fingerprint);

            const filename = docMeta!.docInfo.filename;

            // TODO: we're going to need some type of method to get all the
            // files backing a DocMeta file when we start to use attachments
            // like screenshots.
            // https://firebase.google.com/docs/storage/web/download-files

            if (filename) {
                await asyncWorkQueue.enqueue(async () => handleStashFile(filename));
            }

            await target.writeDocMeta(docMeta!);

            ++completed;

            const progress = Percentages.calculate(completed, total);

            const duration = Date.now() - before;

            listener({completed, total, progress, duration});

        }

        // build a work queue of async functions out of the docMetaFiles.
        docMetaFiles.forEach(docMetaFile =>
                                 asyncWorkQueue.enqueue( async () => handleDocMetaFile(docMetaFile)));

        asyncWorkQueue.execute();

    }

}

export interface TransferEvent {

    readonly completed: number;

    /**
     * The total number of tasks.
     */
    readonly total: number;

    /**
     * The progress as a percentage (0 to 100)
     */
    readonly progress: number;

    readonly duration: number;

}
