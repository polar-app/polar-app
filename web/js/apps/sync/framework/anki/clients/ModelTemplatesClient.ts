import {AnkiConnectFetch} from '../AnkiConnectFetch';

/*
  modelNames

 Gets the complete list of model names for the current user.

 Sample request:

 {
    "action": "modelNames",
    "version": 6
}
 Sample result:

 {
    "result": ["Basic", "Basic (and reversed card)"],
    "error": null
}
 */
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

    /**
     * Create a mock that returns the given result.
     */
    // public static createMock(result: string[]) {
    //     const client = TypeMoq.Mock.ofType<IModelNamesClient>();
    //     client.setup(x => x.execute()).returns(() => Promise.resolve(result));
    //     return client.object;
    // }

}

export interface IModelTemplatesClient {

    execute(modelName: string): Promise<string[]>;

}
