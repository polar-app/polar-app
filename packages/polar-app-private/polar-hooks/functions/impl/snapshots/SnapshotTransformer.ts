import {QueryDocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Transform, TransformCallback, TransformOptions} from 'stream'
import {ZipStreamChunk} from "./ZipStreamChunk";

export class SnapshotTransformer extends Transform {

    constructor(
        // The Firebase collection from which the objects will be coming from (to be transformed)
        private readonly collection: string,
        // The NodeJS Transform class options
        options: Omit<TransformOptions, 'objectMode'> = {},
    ) {
        super({...options, objectMode: true})
    }

    _transform(chunk: any, encoding: any, callback: TransformCallback) {

        console.log('SnapshotTransformer._transform()');
        const snapshot = chunk as QueryDocumentSnapshot;

        // Build a ZipStreamChunk object that is suitable as entry chunks for the "archiver" package
        const zipEntry: ZipStreamChunk = {
            source: JSON.stringify(snapshot.data(), null, '  '),
            data: {
                name: `${this.collection}/${snapshot.id}.json`
            }
        }

        callback(null, zipEntry)
    }

    _flush(callback: TransformCallback) {
        console.log('SnapshotTransformer._flush()')
        callback();
    }

}
