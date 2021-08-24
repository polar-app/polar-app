import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import { Arrays } from "polar-shared/src/util/Arrays";

xdescribe("AnswerExecutor", async function() {

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

    it("covid 1", async function() {

        const answer = await executeQuestion("What happened after a single dose of BNT162b2 vaccine?");

        assert.equal(answer, "Neutralization was on average comparable to that of an asymptomatically infected cohort (NT50 53.8 and 38.5, respectively, P = 0.36), but lower than sera from those who had recovered from mild infection (NT50 438.3, P = 0.003).")

    });

    it("bigtable 1", async function() {

        const answer = await executeQuestion("Is Bigtable relational?");

        assert.equal(answer, "No.")

    });


})
