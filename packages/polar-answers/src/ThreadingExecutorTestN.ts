import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {ThreadingExecutor} from "./ThreadingExecutor";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;

xdescribe("ThreadingExecutor", function() {

    this.timeout(30000000);

    it("basic", async function() {

        const uid = await getUID();

        const res = await ThreadingExecutor.execute({type: 'doc', uid, docIDs: ['3456']})
        console.log('res: ', JSON.stringify(res, null, '  '));


    });


})
