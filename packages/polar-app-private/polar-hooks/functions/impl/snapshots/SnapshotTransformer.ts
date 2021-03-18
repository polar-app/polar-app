import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import {Transform, TransformCallback, TransformOptions} from 'stream'
import {ZipStreamChunk} from "./ZipStreamChunk";

export class SnapshotTransformer extends Transform {

    constructor(private readonly collection: string,
                options: Omit<TransformOptions, 'objectMode'> = {}) {

        super({ ...options, objectMode: true })

    }

    _transform(chunk: any, encoding: any, callback: TransformCallback) {

        const snapshot = chunk as QueryDocumentSnapshot;

        const zipEntry: ZipStreamChunk = {
            source: JSON.stringify(snapshot.data(), null, '  '),
            data: {
                name: `${this.collection}/${snapshot.id}.json`
            }

        }

        callback(null, zipEntry)
    }

    _flush(callback: TransformCallback) {

    }

}
