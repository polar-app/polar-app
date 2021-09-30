import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

/**
 * Document records are indexed like:
 *
 * 0, 1, 2, 3, 4
 *
 * and we don't need 1 and 3 so they would need to be removed from the original
 * set.
 */
export namespace AnswerDigestRecordPruner {

    export function prune(records: ReadonlyArray<IAnswerDigestRecord>) {

        function createMultimapIndex() {

            const multimap = new ArrayListMultimap<string, IAnswerDigestRecord>();

            // create these in the multimap...
            for(const shingle of records) {
                multimap.put(shingle.docID, shingle);
            }

            return multimap;

        }

        function createRecordsPerDocumentSorted(): ReadonlyArray<ReadonlyArray<IAnswerDigestRecord>> {

            const multimap = createMultimapIndex();

            return arrayStream(multimap.keys())
                .map(current => multimap.get(current))
                .map(current => current.sort((a, b) => a.idx - b.idx))
                .collect();

        }

        const recordsPerDocumentSorted = createRecordsPerDocumentSorted();

        function computeRecordsToRemove() {
            return arrayStream(recordsPerDocumentSorted)
                .map(computeRedundantRecords)
                .flatMap(current => current)
                .toMap(current => current.id)
        }

        function computeResult() {

            const recordsToRemove = computeRecordsToRemove();

            function needsRemoval(record: IAnswerDigestRecord) {
                const entry = recordsToRemove[record.id]
                return entry !== undefined && entry !== null;
            }

            return records.filter(current => ! needsRemoval(current));

        }

        return computeResult();

    }

    /**
     * When given a sorted array of shingles, compute the redundant ones.
     */
    export function computeRedundantRecords(records: ReadonlyArray<IAnswerDigestRecord>): ReadonlyArray<IAnswerDigestRecord> {

        let i = 0;

        const result: IAnswerDigestRecord[] = [];

        const siblings = Tuples.createSiblings(records);
        while(i < records.length) {
            const current = siblings[i];

            const adjacent =
                current.prev?.idx === current.curr.idx - 1 && current.next?.idx === current.curr.idx + 1;

            if (adjacent) {
                result.push(current.curr);
                i = i + 2;
            } else {
                ++i;
            }

        }

        return result;

    }
}
