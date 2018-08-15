import {AnkiConnectFetch} from '../AnkiConnectFetch';

export class DeckNamesAndIdsClient {

    static async execute(): Promise<DeckNamesAndIds> {

        let body = {
            action: "deckNamesAndIds",
            version: 6
        };

        let init = { method: 'POST', body: JSON.stringify(body) };

        return <DeckNamesAndIds> await AnkiConnectFetch.fetch(init);

    }

}

export type DeckNamesAndIds = {[deck: string]: number};
