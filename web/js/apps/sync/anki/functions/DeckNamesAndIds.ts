import {Logger} from '../../../../logger/Logger';
import {AnkiConnectFetch} from '../AnkiConnectFetch';

const log = Logger.create();

export class DeckNamesAndIds {

    static async execute(): Promise<{[name: string]: number}> {

        log.info("Running anki debug test code...");

        let body = {
            "action": "deckNamesAndIds",
            "version": 6
        };

        AnkiConnectFetch.fetch({ method: 'POST', body: JSON.stringify(body) })
            .then(res => res.json())
            .then(json => console.log(json));

        return {};

    }

}
