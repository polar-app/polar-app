import {AnswerExecutor} from "./AnswerExecutor";

xdescribe("AnswerExecutor", async function() {

    it("basic", async function() {

        await AnswerExecutor.exec("How many people died of covid?");

    });

})
