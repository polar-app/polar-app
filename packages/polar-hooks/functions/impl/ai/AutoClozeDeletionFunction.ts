import { AutoClozeDeletions } from "polar-backend-api/src/api/AutoClozeDeletion";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import { GCLAnalyzeEntities } from "polar-google-cloud-language/src/GCLAnalyzeEntities";


export namespace AutoClozeDeletion {

    import AutoClozeDeletionError = AutoClozeDeletions.AutoClozeDeletionError;
    import AutoClozeDeletionRequest = AutoClozeDeletions.AutoClozeDeletionRequest;
    import AutoClozeDeletionResponse = AutoClozeDeletions.AutoClozeDeletionResponse;

    function clozeDeletionTagGenerator(seed: number = 1): (deletion: string) => string {
        return (deletion: string): string => {
            const tag = `{{c${seed}::${deletion}}}`
            seed++;
            return tag;
        }
    }
    function generateClozeDeletions(text: string,
                                    entities: ReadonlyArray<GCLAnalyzeEntities.IEntity> ): string {

        let mutText = text;

        const createClozeDeletionTag = clozeDeletionTagGenerator();

        for (const entity of entities) {
            if (entity.name) {
                mutText = mutText.replace(entity.name, createClozeDeletionTag(entity.name))
            }
        }

        return mutText;
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
