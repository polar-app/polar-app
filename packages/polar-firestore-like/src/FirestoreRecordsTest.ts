import {assertJSON} from "polar-test/src/test/Assertions";
import {FirestoreRecords} from "./FirestoreRecords";

describe("FirestoreRecords", () => {

    it("array", () => {

        assertJSON(FirestoreRecords.convert(['hello']), {
            "0": "hello"
        });

    });

    it("nested array", () => {

        const data = {
            foo: {
                bar: [
                    "hello"
                ]
            }
        }

        assertJSON(FirestoreRecords.convert(data), {
            "foo": {
                "bar": {
                    "0": "hello"
                }
            }
        });

    });


})
