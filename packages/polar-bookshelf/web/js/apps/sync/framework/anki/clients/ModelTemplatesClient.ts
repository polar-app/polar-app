import {AnkiConnectFetch} from '../AnkiConnectFetch';

export class ModelTemplatesClient implements IModelTemplatesClient {

    public async execute(modelName: string): Promise<string[]> {

        const body = {
            action: "modelTemplates",
            version: 6,
            params: {
                modelName
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <string[]> await AnkiConnectFetch.fetch(init);

    }

}

export interface IModelTemplatesClient {

    execute(modelName: string): Promise<string[]>;

}
