import {AbstractDatastore, Datastore, DeleteResult} from './Datastore';
import {DelegatedDatastore} from './DelegatedDatastore';
import {IDocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {DocMetaFileRef} from './DocMetaRef';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {UUIDs} from '../metadata/UUIDs';

/**
 * The LazyWriteDatastore keeps a lightweight in-memory index of what's written
 * and prevents double writes of DocMeta but otherwise operates normally.
 */
export class LazyWriteDatastore extends DelegatedDatastore {

    private readonly index = new DocMetaComparisonIndex();

    public nrWrites: number = 0;

    constructor(delegate: Datastore) {
        super(delegate);
    }

    public async write(fingerprint: string,
                       data: any,
                       docInfo: IDocInfo,
                       datastoreMutation?: DatastoreMutation<boolean>): Promise<void> {

        let doUpdated = false;

        if (! this.index.contains(docInfo.fingerprint)) {
            doUpdated = true;
        }

        const docComparison = this.index.get(docInfo.fingerprint);

        if (!docComparison) {
            doUpdated = true;
        }

        if (docComparison && UUIDs.compare(docComparison.uuid, docInfo.uuid) < 0) {
            doUpdated = true;
        }

        if (doUpdated) {
            // when the doc is created and it's not in the index.
            this.index.putDocInfo(docInfo);
            ++this.nrWrites;
            return super.write(fingerprint, data, docInfo, datastoreMutation);
        }

    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        this.index.remove(docMetaFileRef.fingerprint);
        return super.delete(docMetaFileRef);
    }

}
