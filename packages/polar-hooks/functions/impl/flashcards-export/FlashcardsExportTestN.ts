import { AnkiExport } from "./FlashcardsExport";
import { FlashcardExportRequest } from "./FlashCardsExportFunction";
import { existsSync } from "fs";
import { assert } from "chai";

describe("Flashcards export", () => {

    it("basic", async () => {
        const testRequest: FlashcardExportRequest = {
            ankiDeckName: "test",
            targets: [
                "MvRZmJ1Mob",
                "6UbrAqCFxu",
                "FQs3Ru5U"
            ]
        };

        const path = await AnkiExport.create(testRequest, "LeW3bbREKcQWsRnffMZ4Y5DD9Zk1");

        assert.isTrue(existsSync(path));
    });
});