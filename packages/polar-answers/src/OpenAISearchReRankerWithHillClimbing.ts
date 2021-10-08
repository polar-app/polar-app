import {AIModel} from "polar-answers-api/src/AIModel";

export namespace OpenAISearchReRankerWithHillClimbing {

    export async function exec<V>(models: ReadonlyArray<AIModel>,
                                  query: string,
                                  records: ReadonlyArray<V>,
                                  toText: (value: V) => string) {

        // case "ada":
        //     return 0.0008 / 1000;
        // case "babbage":
        //     return 0.0012 / 1000;
        // case "curie":
        //     return 0.0060 / 1000;
        // case "davinci":
        //     return 0.0600 / 1000;

        const modelQueue = [...models];

        const converted = (records: ReadonlyArray<V>) => {

            // when have we converged?

            return records.length <= 200;
        }
        //
        // RecursiveTaskDecompositor.create({
        //     converged
        // })
        //
        // let model = modelQueue.pop();

    }

}
