import {IPersistenceLayer} from "./IPersistenceLayer";
import {Functions, NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {Latch} from "../util/Latch";

export class PersistenceLayers {

    public static async transfer(source: IPersistenceLayer,
                                 target: IPersistenceLayer,
                                 listener: (transferEvent: TransferEvent) => void = NULL_FUNCTION) {

        const docMetaFiles = await source.getDocMetaFiles();

        const before = Date.now();
        const total = docMetaFiles.length;
        let completed = 0;

        for (const docMetaFile of docMetaFiles) {

            // FIXME: binary files too...

            console.log("Working with fingerprint: " + docMetaFile.fingerprint);

            const docMeta = await source.getDocMeta(docMetaFile.fingerprint);
            await target.writeDocMeta(docMeta!);

            ++completed;

            const progress = Percentages.calculate(completed, total);

            const duration = Date.now() - before;

            listener({completed, total, progress, duration});

        }

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
