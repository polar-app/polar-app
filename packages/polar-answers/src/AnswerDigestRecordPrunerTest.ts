import { assertJSON } from "polar-test/src/test/Assertions";
import {AnswerDigestRecordPruner} from "./AnswerDigestRecordPruner";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Numbers} from "polar-shared/src/util/Numbers";
import {assert} from 'chai';

describe("AnswerDigestRecordPruner", () => {

    describe("prune", () => {

        it("empty array", () => {
            assertJSON(AnswerDigestRecordPruner.prune([]), []);
        });

        it("ten records", () => {

            const records = createFakeRecords(10)
            assert.equal(records.length, 10);
            const pruned = AnswerDigestRecordPruner.prune(records);

            assertJSON(pruned.map(current => current.idx), [
                0,
                2,
                4,
                6,
                8,
                9
            ]);

        });

    });

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

        it("just 4", () => {
            const shingles = createFakeRecords(4);
            assert.equal(shingles.length, 4);
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

        it("just 5", () => {
            const shingles = createFakeRecords(5);
            assert.equal(shingles.length, 5);
            assertJSON(AnswerDigestRecordPruner.computeRedundantShingles(shingles), [
                {
                    "type": "pdf",
                    "id": "12ixgLRPXDh1out7QV1UTQG4fDujsPGtuTsFyfi8HBy3Xpo6Zkv",
                    "docID": "12345",
                    "idx": 1,
                    "pageNum": 1,
                    "text": "1"
                },
                {
                    "type": "pdf",
                    "id": "12eFpVUsAhWyHW97ySTi6TwGAPGzBeMBsMyPWJSTN64xiY7fawJ",
                    "docID": "12345",
                    "idx": 3,
                    "pageNum": 1,
                    "text": "3"
                }
            ]);
        });

    });

})

function createFakeRecords(count: number, docID = '12345') : ReadonlyArray<IAnswerDigestRecord> {
    return Numbers.range(0, count - 1)
        .map(current => createFakeRecord(current, docID));
}

function createFakeRecord(idx: number, docID = '12345'): IAnswerDigestRecord {

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
