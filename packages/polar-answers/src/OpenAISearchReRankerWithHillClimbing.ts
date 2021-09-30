import {AIModel} from "polar-answers-api/src/AIModel";
import {OpenAISearchReRanker} from "./OpenAISearchReRanker";

export namespace OpenAISearchReRankerWithHillClimbing {

    // Math.sin()



    import IRecordWithScore = OpenAISearchReRanker.IRecordWithScore;

    export async function exec<V>(models: ReadonlyArray<AIModel>,
                                  query: string,
                                  records: ReadonlyArray<V>,
                                  toText: (value: V) => string) {

        //  Promise<ReadonlyArray<IRecordWithScore<V>>>

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
