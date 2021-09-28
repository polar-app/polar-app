import { assertJSON } from "polar-test/src/test/Assertions";
import {AnswerDigestRecordPruner} from "./AnswerDigestRecordPruner";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Numbers} from "polar-shared/src/util/Numbers";
import {assert} from 'chai';

describe("AnswerDigestRecordPruner", () => {

    describe("computeRedundantShingles", () => {

        it("empty array", () => {
            assertJSON(AnswerDigestRecordPruner.computeRedundantShingles([]), []);
        });

        it("just 1", () => {
            const shingles = createFakeRecords(1);
            assert.equal(shingles.length, 1);
            assertJSON(AnswerDigestRecordPruner.computeRedundantShingles(shingles), []);
        });

        it("just 2", () => {
            const shingles = createFakeRecords(2);
            assert.equal(shingles.length, 2);
            assertJSON(AnswerDigestRecordPruner.computeRedundantShingles(shingles), []);
        });

        it("just 3", () => {
            const shingles = createFakeRecords(3);
            assert.equal(shingles.length, 3);
            assertJSON(AnswerDigestRecordPruner.computeRedundantShingles(shingles), [
                {
                    "type": "pdf",
                    "id": "12ixgLRPXDh1out7QV1UTQG4fDujsPGtuTsFyfi8HBy3Xpo6Zkv",
                    "docID": "12345",
                    "idx": 1,
                    "pageNum": 1,
                    "text": "1"
                }
            ]);
        });

    });

})

function createFakeRecords(count: number) : ReadonlyArray<IAnswerDigestRecord> {
    return Numbers.range(0, count - 1).map(createFakeRecord);
}

function createFakeRecord(idx: number): IAnswerDigestRecord {

    const docID = '12345';
    const id = Hashcodes.create({docID, idx});
    return {
        type: 'pdf',
        id,
        docID,
        idx,
        pageNum: 1,
        text: `${idx}`
    };

}
