import {assert} from "chai";
import {assertJSON} from "polar-test/src/test/Assertions";
import {DeviceIDManager} from "./DeviceIDManager";
import {PositionalArrays} from "./PositionalArrays";
import {Numbers} from "./Numbers";
import PositionalArray = PositionalArrays.PositionalArray;

describe("PositionalArrays", () => {

    describe('parseKey', () => {
        it('should parse a host:position positional array key properly', () => {
            const {position, host} = PositionalArrays.parseKey('device_id:-0000000000000000001');

            assert.equal(position, '-0000000000000000001');
            assert.equal(host, 'device_id');
        });

        it('should parse the old format of positional array keys properly', () => {
            const {position, host} = PositionalArrays.parseKey('55.34234');

            assert.equal(position, '55.34234');
            assert.equal(host, '');
        });

    });

    describe('padPosition', () => {
        it('should pad the number with zeroes to reach a width of 20 digits', () => {
            const padded = PositionalArrays.padPosition(-1.577);

            assert.equal(padded, '-00000000000000001.577');
        });
    });

    describe('generateKey', () => {
        it('should generate a positional array key for the specified position', () => {
            const position = 178.57;
            const key = PositionalArrays.generateKey(position);

            assert.equal(key, `${DeviceIDManager.TEST_DEVICE_ID}:${PositionalArrays.padPosition(position)}`);
        });
    });

    it("basic", () => {

        let arr: PositionalArray<string> = {};
        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123"
        });

    });

    it("multiple appends", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x234"
        });

    });

    it("remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
        });

        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });

    it("removeKey basic", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x200');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x200",
        });

        arr = PositionalArrays.removeKey(arr, PositionalArrays.generateKey(1));

        assertJSON(arr, {
            [PositionalArrays.generateKey(2)]: "0x200",
        });
    });

    it("removeKey that doesn't exist", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x200');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x200",
        });

        arr = PositionalArrays.removeKey(arr, '5');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x200",
        });
    });

    it("insert after", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'after');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x234"
        });

    });

    it("insert before", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "0x234",
            [PositionalArrays.generateKey(1)]: "0x123",
        });

    });

    it("insert before (2x)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x234', '0x123']);

        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x345', '0x234', '0x123']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(-1)]: "0x345",
            [PositionalArrays.generateKey(0)]: "0x234",
            [PositionalArrays.generateKey(1)]: "0x123",
        });

    });

    xit("Keep inserting between to test overrun...", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x1');
        arr = PositionalArrays.append(arr, '0x2');

        let seq = 3;
        const nrInserts = 70

        Numbers.range(1, nrInserts)
            .forEach(() => {
                arr = PositionalArrays.insert(arr, '0x2', `0x${seq++}`, 'before');
            })

        assertJSON(arr, PositionalArrays.toArray(arr));

    });


    it("insert between (before)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x234",
            [PositionalArrays.generateKey(1.5)]: "0x345",
        });

    });

    it("insert between (after)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        arr = PositionalArrays.insert(arr, '0x123', '0x345', 'after');

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x123",
            [PositionalArrays.generateKey(2)]: "0x234",
            [PositionalArrays.generateKey(1.5)]: "0x345",
        });

    });


    it("insert between (after) ... with negative values", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '1');
        arr = PositionalArrays.insert(arr, '1', '2', 'before');
        arr = PositionalArrays.insert(arr, '2', '3', 'before');

        assertJSON(PositionalArrays.toArray(arr), ['3', '2', '1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "2",
            [PositionalArrays.generateKey(1)]: "1",
            [PositionalArrays.generateKey(-1)]: "3"
        });

        arr = PositionalArrays.insert(arr, '3', '4', 'after');
        assertJSON(PositionalArrays.toArray(arr), ['3', '4', '2', '1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "2",
            [PositionalArrays.generateKey(1)]: "1",
            [PositionalArrays.generateKey(-0.5)]: "4",
            [PositionalArrays.generateKey(-1)]: "3"
        });


    });

    it("multiple insertions.. including negative and in between", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x1');
        assertJSON(PositionalArrays.toArray(arr), ['0x1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "0x1",
        });

        arr = PositionalArrays.insert(arr, '0x1', '0x2', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x2', '0x1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "0x2",
            [PositionalArrays.generateKey(1)]: "0x1",
        });

        arr = PositionalArrays.insert(arr, '0x2', '0x3', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x3', '0x2', '0x1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "0x2",
            [PositionalArrays.generateKey(1)]: "0x1",
            [PositionalArrays.generateKey(-1)]: "0x3"
        });

        arr = PositionalArrays.insert(arr, '0x3', '0x4', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x4', '0x3', '0x2', '0x1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "0x2",
            [PositionalArrays.generateKey(1)]: "0x1",
            [PositionalArrays.generateKey(-1)]: "0x3",
            [PositionalArrays.generateKey(-2)]: "0x4"
        });

        // the ptr should be to 0x4 and have a base of -2 and a delta of 0.5 which would set it to -1.5

        arr = PositionalArrays.insert(arr, '0x4', '0x5', 'after');

        assertJSON(PositionalArrays.toArray(arr), ['0x4', '0x5', '0x3', '0x2', '0x1']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(0)]: "0x2",
            [PositionalArrays.generateKey(1)]: "0x1",
            [PositionalArrays.generateKey(-1)]: "0x3",
            [PositionalArrays.generateKey(-1.5)]: "0x5",
            [PositionalArrays.generateKey(-2)]: "0x4"
        });

    });

    it("double (idempotent) remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });


    it("create with existing values", () => {

        const arr: PositionalArray<string> = PositionalArrays.create(['1', '2', '3']);

        assertJSON(arr, {
            [PositionalArrays.generateKey(1)]: "1",
            [PositionalArrays.generateKey(2)]: "2",
            [PositionalArrays.generateKey(3)]: "3",
        });

        assertJSON(PositionalArrays.toArray(arr), ['1', '2', '3']);

    });


    it("should sort by host if the sequences are identical", () => {
        const arr: PositionalArray<string> = {
            "az:-00000000000000000001": "1",
            "aa:-00000000000000000001": "2",
            "ab:-00000000000000000001": "3",
            "ab:-00000000000000000002": "-15",
        };

        assertJSON(PositionalArrays.toArray(arr), ["-15", "2", "3", "1"]);
    });
});

