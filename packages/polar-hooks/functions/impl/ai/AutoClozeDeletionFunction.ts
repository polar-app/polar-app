import {AutoClozeDeletions} from "polar-backend-api/src/api/AutoClozeDeletion";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {GCLAnalyzeEntities} from "polar-google-cloud-language/src/GCLAnalyzeEntities";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {GCL} from "polar-backend-api/src/api/GCL";


export namespace AutoClozeDeletion {

    import AutoClozeDeletionError = AutoClozeDeletions.AutoClozeDeletionError;
    import AutoClozeDeletionRequest = AutoClozeDeletions.AutoClozeDeletionRequest;
    import AutoClozeDeletionResponse = AutoClozeDeletions.AutoClozeDeletionResponse;
    import IEntityMention = GCL.IEntityMention;

    export function _createClozeWithinText(text: string,
                                           start: number,
                                           end: number,
                                           idx: number) {

        const clozedText = text.substring(start, end);

        const replacement = `{{c${idx}::${clozedText}}}`

        return text.substring(0, start) + replacement + text.substring(end, text.length);

    }

    export function generateClozeDeletions(text: string,
                                           entities: ReadonlyArray<GCLAnalyzeEntities.IEntity> ): string {

        let result = text;

        // sort the entities by offset desc...

        function toBeginOffset(mention: IEntityMention) {
            return mention.text?.beginOffset || 0;
        }

        const mentions = arrayStream(entities)
            .map(current => current.mentions)
            .flatMap(current => current!)
            .sort((a, b) => toBeginOffset(b) - toBeginOffset(a))
            .collect()

        let idx = mentions.length;

        for (const mention of mentions) {
            const start = mention.text?.beginOffset || 0;
            const end = start + (mention.text?.content || '').length;
            result = _createClozeWithinText(result, start, end, idx--)
        }

        return result;

    }

    export async function analyzeText(text: string): Promise<AutoClozeDeletionResponse | AutoClozeDeletionError> {

        const analysis = await GCLAnalyzeEntities.analyzeEntities(text);

        if (!analysis.entities) {
            return {
                error: 'no-result'
            };
        }

        return {
            text: generateClozeDeletions(text, analysis.entities),
            GCLResponse: analysis
        }
    }

    export async function exec(idUser: IDUser,
                               request: AutoClozeDeletionRequest): Promise<AutoClozeDeletionResponse | AutoClozeDeletionError> {

        return await analyzeText(request.text);
    }

}

export const AutoClozeDeletionFunction = ExpressFunctions.createRPCHook('AutoClozeDeletionFunction', AutoClozeDeletion.exec);
