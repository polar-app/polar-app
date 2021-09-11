import {GPTCompletionPrompts} from "./GPTCompletionPrompts";
import { GPTCompletions } from "./GPTCompletions";

describe("GPTQuestionsGenerator", function() {

    this.timeout(20000)

    xit("basic", async function() {

        // const sentences = [
        //     "Tutankhamun took the throne at eight or nine years of age under the unprecedented viziership of his eventual successor, Ay, to whom he may have been related.",
        //     "He married his half sister Ankhesenamun. ",
        //     "During their marriage they lost two daughters, one at 5–6 months of pregnancy and the other shortly after birth at full-term.",
        //     "His names—Tutankhaten and Tutankhamun—are thought to mean 'Living image of Aten' and 'Living image of Amun', with Aten replaced by Amun after Akhenaten's death. ",
        //     "A small number of Egyptologists, including Battiscombe Gunn, believe the translation may be incorrect and closer to 'The-life-of-Aten-is-pleasing' or, as Professor Gerhard Fecht believes, reads as 'One-perfect-of-life-is-Aten'"
        // ]

        const sentences = [
            "Over the last two and a half years we have designed, implemented, and deployed a distributed storage system for managing structured data at Google called Bigtable. ",
            "Bigtable is designed to reliably scale to petabytes of data and thousands of machines. " ,
            "Bigtable has achieved several goals: wide applicability, scalability, high performance, and high availability. ",
            "Bigtable is used by more than sixty Google products and projects, including Google Analytics, Google Finance, Orkut, Personalized Search, Writely, and Google Earth. ",
            "These products use Bigtable for a variety of demanding workloads, which range from throughput-oriented batch-processing jobs to latency-sensitive serving of data to end users. ",
            "The Bigtable clusters used by these products span a wide range of configurations, from a handful to thousands of servers, and store up to several hundred terabytes of data."
        ]

        for (const sent of sentences) {
            console.log("====")
            console.log(sent);

            const completion = await GPTCompletions.exec({query_text: sent}, {model: 'curie'})

            if (completion) {

                console.log("front: " + completion.front)
                console.log("back: " + completion.back)

            } else {
                console.log("No completion");
            }

        }

    });

})
