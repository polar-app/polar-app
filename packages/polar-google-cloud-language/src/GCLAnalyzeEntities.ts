import language from '@google-cloud/language'
import {GCLCredentials} from "./GCLCredentials";
import {TextStr} from "polar-shared/src/util/Strings";
import { google } from '@google-cloud/language/build/protos/protos';

export namespace GCLAnalyzeEntities {
    export type IAnalyizeEntitiesResponse = google.cloud.language.v1.IAnalyzeEntitySentimentResponse;
    export type IEntity = google.cloud.language.v1.IEntity;

    export async function analyzeEntities(content: TextStr): Promise<IAnalyizeEntitiesResponse> {

        GCLCredentials.init();

        const client = new language.LanguageServiceClient();

        const [response] = await client.analyzeEntities({
            document: {
                content,
                type: 'PLAIN_TEXT'
            },
            encodingType: 'UTF8'
        });

        return response;
    }

}
