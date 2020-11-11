import {IDUser} from '../util/IDUsers';
import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import {GPTCompletions} from "./GPTCompletions";
import {GPTContentFilter} from "./GPTContentFilter";
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

            // FIXME: call the content filter API for input...
            const input_filter_class = await GPTContentFilter.exec(request.query_text);

            const completions = await GPTCompletions.exec(request);

            // FIXME: call the content filter API for output...
            const output_filter_class = await GPTContentFilter.exec([completions.front, completions.back])

            if (input_filter_class != "safe" || output_filter_class != "safe") {
                throw new Error("Sensitive or Unsafe text");
            }
            else {
                return completions;
            }

        } catch (e) {
            SentryReporters.reportError("Failed to run AutoFlashcardFunction: ", e);
            return {error: 'no-result'};
        }
    }

}
