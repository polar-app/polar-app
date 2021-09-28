import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

/**
 * Document shingles are indexed like:
 *
 * 0, 1, 2, 3, 4
 *
 * and we don't need 1 and 3 so they would need to be removed from the original
 * set.
 */
export namespace AnswerDigestRecordPruner {

    export function prune(shingles: ReadonlyArray<IAnswerDigestRecord>) {

        function createMultimapIndex() {

            const multimap = new ArrayListMultimap<string, IAnswerDigestRecord>();

            // create these in the multimap...
            for(const shingle of shingles) {
                multimap.put(shingle.docID, shingle);
            }

            return multimap;

        }

        function createShinglesPerDocumentSorted(): ReadonlyArray<ReadonlyArray<IAnswerDigestRecord>> {

            const multimap = createMultimapIndex();

            return arrayStream(multimap.keys())
                .map(current => multimap.get(current))
                .map(current => current.sort((a, b) => a.idx - b.idx))
                .collect();

        }

        const shinglesPerDocumentSorted = createShinglesPerDocumentSorted();

        function computeShinglesToRemove() {
            return arrayStream(shinglesPerDocumentSorted)
                .map(computeRedundantShingles)
                .flatMap(current => current)
                .toMap(current => current.id)
        }

        function computeResult() {
            const shinglesToRemove = computeShinglesToRemove();
            return shingles.filter(current => shinglesToRemove[current.id] === null);
        }

        return computeResult();

    }

    /**
     * When given a sorted array of shingles, compute the redundant ones.
     */
    export function computeRedundantShingles(shingles: ReadonlyArray<IAnswerDigestRecord>): ReadonlyArray<IAnswerDigestRecord> {

        let i = 0;

        const result: IAnswerDigestRecord[] = [];

        const siblings = Tuples.createSiblings(shingles);
        while(i < shingles.length) {
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
