import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

export class DeckNamesAndIdsClient implements IDeckNamesAndIdsClient {

    async execute(): Promise<DeckNamesAndIds> {

        let body = {
            action: "deckNamesAndIds",
            version: 6
        };

        let init = { method: 'POST', body: JSON.stringify(body) };

        return <DeckNamesAndIds> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    static createMock(result: DeckNamesAndIds) {
        let client = TypeMoq.Mock.ofType<IDeckNamesAndIdsClient>();
        client.setup(x => x.execute()).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export type DeckNamesAndIds = {[deck: string]: number};

export interface IDeckNamesAndIdsClient {

    execute(): Promise<DeckNamesAndIds>;

}
