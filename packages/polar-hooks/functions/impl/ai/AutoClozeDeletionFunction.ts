import { AutoClozeDeletionError, AutoClozeDeletionRequest, AutoClozeDeletionResponse } from "polar-backend-api/src/api/AutoClozeDeletion";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import { GCLAnalyzeEntities } from "polar-google-cloud-language/src/GCLAnalyzeEntities";

export namespace AutoClozeDeletion {

    function generateClozeDeletions( text: string,
        entities: ReadonlyArray<GCLAnalyzeEntities.IEntity> ): ReadonlyArray<string> {

        const clozeDeletions = [];

        for (const entity of entities) {
            if (entity.name) {
                clozeDeletions.push(
                    text.replace(entity.name, `{{c1::${entity.name}}}`)
                );
            }
        }

        return clozeDeletions;
    }

    export async function analyzeText(text: string): Promise<AutoClozeDeletionResponse | AutoClozeDeletionError> {

        const analysis = await GCLAnalyzeEntities.analyzeEntities(text);

        if (!analysis.entities) {
            return {
                error: 'no-result'
            };
        }

        return {
            clozeDeletions: generateClozeDeletions(text, analysis.entities),
            GCLResponse: analysis
        }
    }

    export async function exec( idUser: IDUser,
        request: AutoClozeDeletionRequest ): Promise<AutoClozeDeletionResponse | AutoClozeDeletionError> {
        
        return await analyzeText(request.text);
    }

}

export const AutoClozeDeletionFunction = ExpressFunctions.createRPCHook('AutoClozeDeletionFunction', AutoClozeDeletion.exec);