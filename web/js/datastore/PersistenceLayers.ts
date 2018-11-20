import {IPersistenceLayer} from "./IPersistenceLayer";
import {NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {Backend} from './Backend';
import {Blobs} from "../util/Blobs";
import {ArrayBuffers} from "../util/ArrayBuffers";
import {AsyncFunction, AsyncWorkQueue} from '../util/AsyncWorkQueue';
import {DocMetaRef} from "./DocMetaRef";
import {FileRef} from './Datastore';

export class PersistenceLayers {

    public static async transfer(source: IPersistenceLayer,
                                 target: IPersistenceLayer,
                                 listener: (transferEvent: TransferEvent) => void = NULL_FUNCTION) {

        async function handleStashFile(fileRef: FileRef) {

            if (! target.containsFile(Backend.STASH, fileRef)) {

                const optionalFile = await source.getFile(Backend.STASH, fileRef);

                if (optionalFile.isPresent()) {
                    const file = optionalFile.get();
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    const arrayBuffer = await Blobs.toArrayBuffer(blob);
                    const buffer = ArrayBuffers.toBuffer(arrayBuffer);

                    target.writeFile(file.backend, fileRef, buffer, file.meta);
                }

            }

        }

        async function handleDocMetaFile(docMetaFile: DocMetaRef) {

            console.log("Working with fingerprint: " + docMetaFile.fingerprint);

            const docMeta = await source.getDocMeta(docMetaFile.fingerprint);

            const docFile: FileRef = {
                name: docMeta!.docInfo.filename!,
                hashcode: docMeta!.docInfo.hashcode
            };

            // TODO: we're going to need some type of method to get all the
            // files backing a DocMeta file when we start to use attachments
            // like screenshots.
            // https://firebase.google.com/docs/storage/web/download-files

            if (docFile.name) {
                // TODO: if we use the second queue it still locks up.
                // await docFileAsyncWorkQueue.enqueue(async () => handleStashFile(docFile));
                await handleStashFile(docFile);
            }

            await target.writeDocMeta(docMeta!);

            ++completed;

            const progress = Percentages.calculate(completed, total);

            const duration = Date.now() - before;

            listener({completed, total, progress, duration});

        }

        const docMetaFiles = await source.getDocMetaFiles();

        const before = Date.now();
        const total = docMetaFiles.length;
        let completed = 0;

        const docFileAsyncWorkQueue = new AsyncWorkQueue([]);
        const docMetaAsyncWorkQueue = new AsyncWorkQueue([]);

        // build a work queue of async functions out of the docMetaFiles.
        docMetaFiles.forEach(docMetaFile =>
                                 docMetaAsyncWorkQueue.enqueue( async () => handleDocMetaFile(docMetaFile)));

        const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
        const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();

        await Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);

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
