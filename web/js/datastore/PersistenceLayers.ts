import {IPersistenceLayer} from "./IPersistenceLayer";
import {NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {ParallelWorkQueue} from '../util/ParallelWorkQueue';
import {Backend} from './Backend';
import {Blobs} from "../util/Blobs";
import {ArrayBuffers} from "../util/ArrayBuffers";

export class PersistenceLayers {

    public static async transfer(source: IPersistenceLayer,
                                 target: IPersistenceLayer,
                                 listener: (transferEvent: TransferEvent) => void = NULL_FUNCTION) {

        const docMetaFiles = await source.getDocMetaFiles();

        const before = Date.now();
        const total = docMetaFiles.length;
        let completed = 0;

        // TODO: we should do the nested queue design like we did with anki and
        // just keep pushing / appending documents to the queue as we discovery
        // them.
        await new ParallelWorkQueue(docMetaFiles, async (docMetaFile) => {

            console.log("Working with fingerprint: " + docMetaFile.fingerprint);

            const docMeta = await source.getDocMeta(docMetaFile.fingerprint);

            const filename = docMeta!.docInfo.filename;

            // TODO: we're going to need some type of method to get all the
            // files backing a DocMeta file when we start to use attachments
            // like screenshots.
            // https://firebase.google.com/docs/storage/web/download-files

            if (filename) {

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

            await target.writeDocMeta(docMeta!);

            ++completed;

            const progress = Percentages.calculate(completed, total);

            const duration = Date.now() - before;

            listener({completed, total, progress, duration});

        }).execute();

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
