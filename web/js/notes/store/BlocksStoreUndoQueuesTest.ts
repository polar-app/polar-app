import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {assertJSON} from "../../test/Assertions";

describe("BlocksStoreUndoQueues", () => {

    describe("computeItemsPatch", () => {

        it("remove", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], []), [
                {
                    "type": "remove",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch([], ['1']), [
                {
                    "type": "unshift",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], ['1', '2']), [
                {
                    "type": "insert",
                    "ref": "1",
                    "id": "2",
                    "pos": "after"
                }
            ]);

        });


        it("insert before", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], ['2', '1']), [
                {
                    "type": "insert",
                    "ref": "1",
                    "id": "2",
                    "pos": "before"
                }
            ]);

        });


    });

});
