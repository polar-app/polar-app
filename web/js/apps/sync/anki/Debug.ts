import {Logger} from '../../../logger/Logger';
import fetch from 'node-fetch';
import {AnkiConnectResponse} from './AnkiConnectResponse';
import {AnkiConnectFetch} from './AnkiConnectFetch';

const log = Logger.create();

async function exec() {

    log.info("Running anki debug test code...");

    let body = {
        "action": "deckNamesAndIds",
        "version": 6
    };

    let response = await AnkiConnectFetch.fetch({ method: 'POST', body: JSON.stringify(body) });

    console.log("response: " , response)

        // .then(res => res.json())
        // .then(json => console.log(json));

}

exec()
    .then(() => log.info("done"))
    .catch(err => log.error("Failed: ", err));
