import {assert} from "chai";
import {OpenAICostEstimator} from "./OpenAICostEstimator";
import {OpenAISearchClient} from "./OpenAISearchClient";
import {AnswerExecutor} from "./AnswerExecutor";

const fakeDocument = 'The Milky Way is the galaxy that includes the Solar System, with the name describing the galaxy\'s appearance from Earth: a hazy band of light seen in the night sky formed from stars that cannot be individually distinguished by the naked eye. The term Milky Way is a translation of the Latin via lactea, from the Greek γαλακτικός κύκλος (galaktikos kýklos), meaning "milky circle."[20][21][22] From Earth, the Milky Way appears as a band because its disk-shaped structure is viewed from within. Galileo Galilei first resolved the band of light into individual stars with his telescope in 1610. Until the early 1920s, most astronomers thought that the Milky Way contained all the stars in the Universe.[23] Following the 1920 Great Debate between the astronomers Harlow Shapley and Heber Curtis,[24] observations by Edwin Hubble showed that the Milky Way is just one of many galaxies.';

describe('OpenAICostEstimator', function () {
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

        assert.equal(costOfSearch, 0.044340000000000004);
    });

    it('OpenAICostEstimator.costOfAnswers() example 1', async () => {
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
        const costOfSearch = OpenAICostEstimator.costOfAnswers({
            model,
            question: query,
            documents,
            examples: AnswerExecutor.EXAMPLES,
            examples_context: AnswerExecutor.EXAMPLES_CONTEXT,
        }, {
            answers: [
                'There are 9 planets in the Milky Way',
                'The Milky Way consists of 9 planets and a Sun',
            ],
            model: model,
            search_model: 'ada',
            selected_documents: []
        })

        assert.equal(costOfSearch, 0.007538);
    });
});
