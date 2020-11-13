import {IDUser} from '../util/IDUsers';
import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import {GPTCompletions} from "./GPTCompletions";
import {GPTCompletions} from "./GPTCompletions";
import {SentryReporters} from "../reporters/SentryReporter";

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

            const inputClassification = await GPTCompletions.exec([request.query_text]);

            GPTCompletions.assertClassification(inputClassification);

            const completions = await GPTCompletions.exec(request);

            const outputClassification = await GPTCompletions.exec([completions.front, completions.back])

            GPTCompletions.assertClassification(outputClassification);

            return completions;

        } catch (e) {
            SentryReporters.reportError("Failed to run AutoFlashcardFunction: ", e);
            return {error: 'no-result'};
        }

    }

}
