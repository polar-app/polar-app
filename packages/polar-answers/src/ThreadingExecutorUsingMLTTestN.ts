import {ThreadingExecutorUsingMLT} from "./ThreadingExecutorUsingMLT";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;

xdescribe("ThreadingExecutorUsingMLT", function() {

    this.timeout(30000000);

    it("basic", async function() {

        const uid = await getUID();

        const res = await ThreadingExecutorUsingMLT.execute({type: 'context', uid, identifiers: ['3456']})
        console.log('res: ', JSON.stringify(res, null, '  '));


    });

})
