import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IAnswerExecutorError} from "polar-answers-api/src/IAnswerExecutorResponse";

describe("AnswerExecutor", function () {

    this.timeout(600000);

    const app = FirebaseAdmin.app()

    async function getUID(forEmail = 'burton@inputneuron.io') {
        const auth = app.auth();
        const user = await auth.getUserByEmail(forEmail)

        if (!user) {
            throw new Error("no user");
        }

        return user.uid;

    }

    async function executeQuestion(question: string, forEmail = 'burton@inputneuron.io') {

        const uid = await getUID(forEmail);

        const response = await AnswerExecutor.exec({
            uid,
            question,
            model: 'ada',
            search_model: 'ada',
            documents_limit: 1
        });

        function isError(value: any): value is IAnswerExecutorError {
            return value.error === true;
        }

        if (! isError(response)) {

            console.log("answer: ", Arrays.first(response.answers))

            console.log("response: " + JSON.stringify(response, null, '  '));

            return response.answers[0];

        } else {
            throw new Error(response.code);
        }

    }

    describe("basic", () => {

        // TODO: this fails now with 'Sera drawn between 7 and 17 days after a second dose of' for some reason.
        it("What is a Planet?", async function () {

            const answer = await executeQuestion("What is a Planet?");
            assert.isDefined(answer);

        });
    });

})


