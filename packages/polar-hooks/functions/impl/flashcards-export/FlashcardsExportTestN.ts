import { AnkiExport } from "./FlashcardsExport";
import { FlashcardExportRequest } from "./FlashCardsExportFunction";
import { existsSync } from "fs";
import { assert } from "chai";

describe("Flashcards export", () => {

    const TARGET_BLOCK_IDS = [
        "MvRZmJ1Mob",
        "6UbrAqCFxu"
    ];

    const TEST_UID = "LeW3bbREKcQWsRnffMZ4Y5DD9Zk1";

    it("basic", async () => {
        const testRequest: FlashcardExportRequest = {
            ankiDeckName: "test",
            blockIDs: TARGET_BLOCK_IDS 
        };

        const path = await AnkiExport.create(testRequest, TEST_UID);

        assert.isTrue(existsSync(path));
    });
});