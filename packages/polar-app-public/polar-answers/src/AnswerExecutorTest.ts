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

    async function assertQuestionAndAnswer(question: string, expectedAnswer: string | ReadonlyArray<string>) {

        const answer = await executeQuestion(question);

        if (typeof expectedAnswer === 'string') {
            assert.equal(answer, expectedAnswer);
        }

        assert.ok(expectedAnswer.includes(answer), `Answer '${answer}' was not expected: ` + JSON.stringify(expectedAnswer));

    }

    // TODO
    // - bigtable question with no docs
    // - verify we can link back...

    it("covid 1", async function() {

        const answer = await executeQuestion("What happened after a single dose of BNT162b2 vaccine?");

        assert.equal(answer, "Neutralization was on average comparable to that of an asymptomatically infected cohort (NT50 53.8 and 38.5, respectively, P = 0.36), but lower than sera from those who had recovered from mild infection (NT50 438.3, P = 0.003).")

    });

    xit("covid 2", async function() {
        // TODO: should work

        const answer = await executeQuestion("What do two doses of SARS-CoV-2 vaccination induce?");

        assert.equal(answer, "")

    });

    xit("covid 3", async function() {

        const answer = await executeQuestion("What neutralized the prototype B virus?");

        // it properly includes this hit BUT is unable to compute the anser
        //     {
        //       document: 1,
        //       object: 'search_result',
        //       score: 512.517,
        //       text: 'Neutralization by sera from COVID-19 convalescents.  Sera\n' +
        //         'from convalescent individuals neutralized prototype B virus with\n' +
        //         'highly variable potency (NT50 range <5 to 1140, Fig.  3c and e),\n' +
        //         'though sera from those with mild symptoms were significantly\n' +
        //         'more potent on average than those with asymptomatic infection\n' +
        //         '(NT50 438.4 and 38.5, respectively, P = 0.002).  Neutralization\n' +
        //         'titres against B.1.1.7 were below the limit of detection in 9/12\n' +
        //         'asymptomatic convalescent individuals but were detectable in all\n' +
        //         'those with mild symptoms. '
        //     }

        assert.equal(answer, "")

    });


    it("bigtable 1", async function() {

        const answer = await executeQuestion("Is Bigtable relational?");

        assert.equal(answer, "No.")

    });

    it("bigtable single-row transactions", async function() {

        const answer = await executeQuestion("Does Bigtable support single-row transactions?");

        assert.equal(answer, "Yes.")

    });


    it("bigtable general transactions", async function() {

        const answer = await executeQuestion("Does Bigtable support general transactions?");

        assert.equal(answer, "No.")

    });

    // FIXME: test return_metadata
    // FIXME: ES bias for short terms...

    xit("TODO: bigtable type of transactions", async function() {

        // TODO: not supported yet. I need to extend examples and examples_context here

        const answer = await executeQuestion("What types of transactions does bigtable support?");

        assert.equal(answer, "")

    });

    it("bigtable unknown 1", async function() {

        const answer = await executeQuestion("Is Bigtable a foobar?");

        assert.equal(answer, "__UNKNOWN__")

    });

    it("bigtable unknown 2", async function() {


    });

    it("bigtable store logs ", async function() {

        await assertQuestionAndAnswer("How does Bigtable store log and data files?", [
            "Google File System (GFS)",
            "GFS.",
            "In GFS."
        ])

    })


    it("bigtable cluster mgmt system ", async function() {

        // When a master is started by the cluster management system, it needs
        // to discover the current tablet assignments before it can change
        // them. The master executes the following steps at startup. (1) The
        // master grabs a unique master lock in Chubby, which prevents con-
        // current master instantiations.

        await assertQuestionAndAnswer("What does the master need to do when it is started by the cluster management system?", [
            "Discover the current tablet assignments."
        ])

    })

})
