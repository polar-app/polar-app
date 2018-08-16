import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/**
 Create a new empty deck. Will not overwrite a deck that exists with the same
 name.

 Sample request:

 {
    "action": "createDeck",
    "version": 6,
    "params": {
    "deck": "Japanese::Tokyo"
}
}
 Sample result:

 {
    "result": 1519323742721,
    "error": null
}

 */
export class CreateDeckClient implements ICreateDeckClient {

    public async execute(deck: string): Promise<number> {

        let body = {
            action: "createDeck",
            version: 6,
            params: {
                deck
            }
        };

        let init = { method: 'POST', body: JSON.stringify(body) };

        return <number> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    static createMock(result: number) {
        let client = TypeMoq.Mock.ofType<ICreateDeckClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface ICreateDeckClient {

    execute(deck: string): Promise<number>;

}

