import {MemoryLogger} from "./MemoryLogger";
import {assertJSON} from "../test/Assertions";

describe('MemoryLogger', function() {

    it("basic", function () {
        let memoryLogger = new MemoryLogger();

        memoryLogger.info("hello", "world");

        let expected = [
            {
                "level": "info",
                "msg": "hello",
                "args": [
                    "world"
                ]
            }
        ];
        assertJSON(memoryLogger.toJSON(), expected);

    });

});
