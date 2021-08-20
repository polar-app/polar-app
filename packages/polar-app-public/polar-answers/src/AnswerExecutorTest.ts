import {AnswerExecutor} from "./AnswerExecutor";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

xdescribe("AnswerExecutor", async function() {

    this.timeout(60000);

    it("basic", async function() {

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        const response = await AnswerExecutor.exec({
            uid: user.uid,
            question: "Does Bigtable support a full relational model?"
        });

        console.log(response);

    });

})
