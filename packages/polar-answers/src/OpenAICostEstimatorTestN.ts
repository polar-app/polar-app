import {assert} from "chai";
import {OpenAICostEstimator} from "./OpenAICostEstimator";
import {AnswerExecutor} from "./AnswerExecutor";
import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {IOpenAIAnswersResponseWithPrompt} from "polar-answers-api/src/IOpenAIAnswersResponse";
import {Numbers} from "polar-shared/src/util/Numbers";
import {IOpenAIAnswersRequest} from "polar-answers-api/src/IOpenAIAnswersRequest";

const fakeDocument = 'The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy\'s appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning "milky circle."[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies.';

describe('OpenAICostEstimator', function () {

    this.timeout(60000);

    it('OpenAICostEstimator.costOfSearch() example 1', async () => {
        const model = 'curie';
        const query = "How many planets are there in the Milky Way?";
        const documents = [];
        for (let i = 0; i < 30; i++) {
            documents.push(fakeDocument);
        }

        // await OpenAISearchClient.exec(model, {
        //     documents,
        //     query,
        // });
        const costOfSearch = OpenAICostEstimator.costOfSearch({
            query,
            documents,
            model,
        })

        assert.equal(costOfSearch.cost, 0.041544);
    });

    it('OpenAICostEstimator.costOfAnswers() example 1', async () => {

        const model = 'babbage';
        const query = "Is the Milky Way a galaxy?";

        function computeDocuments(): ReadonlyArray<string> {
            return Numbers.range(0, 30).map(() => fakeDocument);
        }

        const documents = computeDocuments();

        interface IPromptAndAnswers {
            readonly prompt: string;
            readonly answers: ReadonlyArray<string>
        }

        async function computePromptAndAnswersUsingClient(): Promise<IPromptAndAnswers> {

            const res = await OpenAIAnswersClient.exec({
                model,
                question: query,
                documents,
                examples: AnswerExecutor.EXAMPLES,
                examples_context: AnswerExecutor.EXAMPLES_CONTEXT,
                return_prompt: true,
                stop: ["\n", "<|endoftext|>"]
            });

            const resWithPrompt = res as IOpenAIAnswersResponseWithPrompt;

            return {
                prompt: resWithPrompt.prompt,
                answers: res.answers
            }

        }

        async function computePromptAndAnswersUsingDebugData() {

            // 1:24 PM
            return {
                "prompt": "Please answer the question according to the above context.\n===\nContext: In 2017, U.S. life expectancy was 78.6 years.  Google Analytics is a service that helps webmasters analyze traffic patterns at their web sites.  It provides aggregate statistics, such as the number of unique visitors per day and the page views per URL per day, as well as site-tracking reports, such as the percentage of users that made a purchase, given that they earlier viewed a specific page.  To enable the service, webmasters embed a small JavaScript program in their web pages.\n===\nQ: What does Google Analytics provide?\nA: It provides aggregate statistics, such as the number of unique visitors per day and the page views per URL per day.\n---\nQ: What do dinosaurs capilate?\nA: __UNKNOWN__\n---\nQ: Is foo a bar?\nA: __UNKNOWN__\n---\nQ: Who is the President of Xexptronica\nA: __UNKNOWN__\n---\nQ: What is human life expectancy in the United States?\nA: 78 years.\n---\nQ: What is Google Analytics\nA: Google Analytics is a service that helps webmasters analyze patterns at their web sites.\n\n===\nContext: The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies. The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy's appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning \"milky circle.\"[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies.\n===\nQ: Is the Milky Way a galaxy?\nA:",
                "answers": [
                    "__NO__"
                ]
            }

        }

        const promptAndAnswers = await computePromptAndAnswersUsingDebugData();

        console.log("Computing with prompt and answers: ", JSON.stringify(promptAndAnswers, null, "  "));

        const req: IOpenAIAnswersRequest = {
            model,
            question: query,
            documents,
            examples: AnswerExecutor.EXAMPLES,
            examples_context: AnswerExecutor.EXAMPLES_CONTEXT,
            return_prompt: true
        };

        const res: IOpenAIAnswersResponseWithPrompt = {
            model: model,
            search_model: 'ada',
            selected_documents: [],
            ...promptAndAnswers,
        }

        const costOfAnswers = OpenAICostEstimator.costOfAnswers(req, res)

        assert.deepEqual(costOfAnswers, {
            "completion": {
                "model": "babbage",
                "cost": 0.0023208,
                "tokens": 1934
            },
            "search": {
                "model": "ada",
                "cost": 0.0056464,
                "tokens": 7058
            },
            "cost": 0.0079672,
            "tokens": 8992
        });

    });
});