import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import { Arrays } from "polar-shared/src/util/Arrays";

describe("AnswerExecutor", async function() {

    this.timeout(60000);

    async function getUID() {

        const app = FirebaseAdmin.app()

        const auth = app.auth();
        const user = await auth.getUserByEmail('burton@inputneuron.io')

        if (! user) {
            throw new Error("no user");
        }

        return user.uid;

    }

    async function executeQuestion(question: string) {

        const uid = await getUID();

        const response = await AnswerExecutor.exec({
            uid,
            question
        });

        console.log("answer: ", Arrays.first(response.answers))

        console.log(response);

        return response.answers[0];

    }

    // TODO
    // - bigtable question with no docs
    // - verify we can link back... 
    // - test with temperature... 
    
    it("basic", async function() {

        const answer = await executeQuestion("What happened after a single dose of BNT162b2 vaccine?");

        assert.equal(answer, "Neutralization was undetectable against B.1.1.7 in 7/11 samples, and in all 11 sera tested against B.1.351.")

    });

})
