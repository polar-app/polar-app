import {Logger} from '../../../logger/Logger';
import {AnkiConnectFetch} from './AnkiConnectFetch';
import {DeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';

const log = Logger.create();

async function exec() {

    log.info("Running anki debug test code...");

    let body = {
        "action": "deckNamesAndIds",
        "version": 6
    };

    //let response = await AnkiConnectFetch.fetch({ method: 'POST', body: JSON.stringify(body) });

    let deckNamesAndIds = await new DeckNamesAndIdsClient().execute();

    console.log("deckNamesAndIds: " , deckNamesAndIds)

        // .then(res => res.json())
        // .then(json => console.log(json));

}

exec()
    .then(() => log.info("done"))
    .catch(err => log.error("Failed: ", err));
