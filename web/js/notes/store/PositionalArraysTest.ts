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


    it("double (idempotent) remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });

});
