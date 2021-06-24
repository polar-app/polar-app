import {AnswerExecutor} from "./AnswerExecutor";

describe("AnswerExecutor", async function() {

    it("basic", async function() {

        await AnswerExecutor.exec("How many people died of covid?");

    });

})
