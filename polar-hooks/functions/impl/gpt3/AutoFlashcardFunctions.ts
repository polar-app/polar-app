import {IDUser} from '../util/IDUsers';
import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import {GPTCompletions} from "./GPTCompletions";
import {SentryReporters} from "../reporters/SentryReporter";
import {GPTContentFilters} from "./GPTContentFilters";

export class AutoFlashcardFunctions {

    /**
     *
     * @param idUser has Firebase user information
     * @param request has the request we want to execute.  We need to define the request
     * params need but this is send with the original POST with what we want to classify.
     */
    public static async exec(idUser: IDUser,
                             request: AutoFlashcards.AutoFlashcardRequest): Promise<AutoFlashcards.AutoFlashcardResponse | AutoFlashcards.AutoFlashcardError> {

        try {

            const inputClassification = await GPTContentFilters.exec([request.query_text]);

            GPTContentFilters.assertClassification(inputClassification);

            const completionResponse = await GPTCompletions.exec(request);

            if (! completionResponse) {
                return {
                    error: 'no-result'
                }
            }

            const outputClassification = await GPTContentFilters.exec([completionResponse.front, completionResponse.back])

            GPTContentFilters.assertClassification(outputClassification);

            return completionResponse;

        } catch (e) {
            SentryReporters.reportError("Failed to run AutoFlashcardFunction: ", e);
            return {error: 'no-result'};
        }

    }

}
