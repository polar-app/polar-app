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

    async function assertQuestionAndAnswer(question: string, expectedAnswer: string | ReadonlyArray<string>) {

        const answer = await executeQuestion(question);

        if (typeof expectedAnswer === 'string') {
            assert.equal(answer, expectedAnswer);
        }

        assert.ok(expectedAnswer.includes(answer), `Answer '${answer}' was not expected: ` + JSON.stringify(expectedAnswer));

    }

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

    xit("bigtable GA 1", async function() {

        //     {
        //       document: 17,
        //       object: 'search_result',
        //       score: 244.793,
        //       text: 'In the rest of this section, we brie y\n' +
        //         'describe how three product teams use Bigtable.  8.1 Google Analytics\n' +
        //         'Google Analytics (analytics.google.com)  is a service\n' +
        //         'that helps webmasters analyze traf c patterns at their\n' +
        //         'web sites.  It provides aggregate statistics, such as the\n' +
        //         'number of unique visitors per day and the page views\n' +
        //         'per URL per day, as well as site-tracking reports, such as\n' +
        //         'the percentage of users that made a purchase, given that\n' +
        //         'they earlier viewed a speci c page.  To enable the service, webmasters embed a  small\n' +
        //         'JavaScript program in their web pages. '
        //     },

        // this is properly indexed BUT we're not answering this correctly regardless.

        await assertQuestionAndAnswer("What is Google Analytics?", [
            ""
        ])

    })

    xit("bigtable GA 2", async function() {

        // TODO: this doesn't work because I get the following sentence?
        // This might be because we're improperly computing sentence tokens?
        // We should be able to get the previous text included.

        //       text: 'It provides aggregate statistics, such as the\n' +
        //         'number of unique visitors per day and the page views\n' +
        //         'per URL per day, as well as site-tracking reports, such as\n' +
        //         'the percentage of users that made a purchase, given that\n' +
        //         'they earlier viewed a speci c page.  To enable the service, webmasters embed a  small\n' +
        //         'JavaScript program in their web pages.  This program\n' +
        //         'is invoked whenever a page is visited.  It records various\n' +
        //         'information about the request in Google Analytics, such\n' +
        //         'as a user identi er and information about the page be-\n' +
        //         'ing fetched. '
        //     }

        await assertQuestionAndAnswer("What does Google Analytics provide?", [
            ""
        ])

    })

})
