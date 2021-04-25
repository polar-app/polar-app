import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import {assertJSON} from "../../test/Assertions";

describe("PositionalArrays", () => {

    it("basic", () => {

        let arr: PositionalArray<string> = {};
        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123"
        });

    });

    it("multiple appends", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234"
        });

    });

    it("remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });

    it("insert after", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'after');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234"
        });

    });

    it("insert before", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');

        assertJSON(arr, {
            "0": "0x234",
            "1": "0x123",
        });

    });

    it("insert before (2x)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');
        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');

        assertJSON(arr, {
            "-1": "0x345",
            "0": "0x234",
            "1": "0x123",
        });

    });

    it("insert between", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234",
            "1.5": "0x345",
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

});
