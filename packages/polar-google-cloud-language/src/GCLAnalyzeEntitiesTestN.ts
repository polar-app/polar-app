import {GCLAnalyzeEntities} from "./GCLAnalyzeEntities";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("GCLAnalyzeEntities", function() {

    describe("analyzeEntities", () => {

        it("double mentions", async () => {

            const text = "This is the first mention of Sacramento and this is the second mention of Sacramento."

            const analysis = await GCLAnalyzeEntities.analyzeEntities(text);

            console.log(JSON.stringify(analysis, null, '  '));

        });


        it("extended", async () => {

            const text = "Yes, he owned slaves. He owned more than two hundred."

            const analysis = await GCLAnalyzeEntities.analyzeEntities(text);
            console.log(JSON.stringify(analysis, null, '  '));

            assertJSON(analysis, {
                "entities": [
                    {
                        "mentions": [
                            {
                                "sentiment": null,
                                "text": {
                                    "beginOffset": 14,
                                    "content": "slaves"
                                },
                                "type": "COMMON"
                            }
                        ],
                        "metadata": {},
                        "name": "slaves",
                        "salience": 1,
                        "sentiment": null,
                        "type": "PERSON"
                    },
                    {
                        "mentions": [
                            {
                                "sentiment": null,
                                "text": {
                                    "beginOffset": 41,
                                    "content": "two hundred"
                                },
                                "type": "TYPE_UNKNOWN"
                            }
                        ],
                        "metadata": {
                            "value": "200"
                        },
                        "name": "two hundred",
                        "salience": 0,
                        "sentiment": null,
                        "type": "NUMBER"
                    }
                ],
                "language": "en"
            })

        });

    });

})
