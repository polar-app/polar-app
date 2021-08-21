import {AnswerExecutor} from "./AnswerExecutor";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import { Arrays } from "polar-shared/src/util/Arrays";

xdescribe("AnswerExecutor", async function() {

    this.timeout(60000);

    it("basic", async function() {

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        const response = await AnswerExecutor.exec({
            uid: user.uid,
            question: "What happened after a single dose of BNT162b2 vaccine?"
        });

        console.log("answer: ", Arrays.first(response.answers))

        console.log(response);


    });

})
