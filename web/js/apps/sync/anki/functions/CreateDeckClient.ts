
import {AnkiConnectFetch} from '../AnkiConnectFetch';

// Create a new empty deck. Will not overwrite a deck that exists with the same name.
//
//     Sample request:
//
// {
//     "action": "createDeck",
//     "version": 6,
//     "params": {
//     "deck": "Japanese::Tokyo"
// }
// }
// Sample result:
//
// {
//     "result": 1519323742721,
//     "error": null
// }


/**
 *
 */
export class CreateDeckClient {

    static async execute(deck: string): Promise<number> {

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

}
