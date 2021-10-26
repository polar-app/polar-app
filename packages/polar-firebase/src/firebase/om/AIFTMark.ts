import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr} from "polar-shared/src/util/Strings";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AIFTMark {

    const COLLECTION_NAME = 'ai_ft_mark';

    export type Mark = 'invalid';

    export interface IAIFTMark {
        readonly id: string;
        readonly mark: Mark;
    }

    export async function write<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, mark: Mark) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const value: IAIFTMark = {
            id, mark
        }

        await ref.set(value);

    }

    export async function get<SM = unknown>(firestore: IFirestore<SM>, id: IDStr): Promise<IAIFTMark | undefined> {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const snap = await ref.get();

        if (! snap.exists) {
            return undefined;
        }

        return snap.data() as IAIFTMark;

    }

    // TODO: move this to Collections
    export async function getMulti<SM = unknown>(firestore: IFirestore<SM>, identifiers: ReadonlyArray<IDStr>): Promise<ReadonlyArray<IAIFTMark | undefined>> {
        return await Promise.all(identifiers.map(current => get(firestore, current)))
    }

    // TODO: move this to Collections
    export type MultiMapType = {
        readonly [id: string]: IAIFTMark
    }

    // TODO: move this to Collections
    export async function getMultiAsMap<SM = unknown>(firestore: IFirestore<SM>, identifiers: ReadonlyArray<IDStr>): Promise<Readonly<MultiMapType>> {

        const result: MultiMapType = {};

        const multi
            = arrayStream(await getMulti(firestore, identifiers))
                .filterPresent()
                .collect();

        for(const current of multi) {
            result[current.id] = current;
        }

        return result;

    }

}


