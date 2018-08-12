import {Logger} from '../../../logger/Logger';
import fetch from 'node-fetch';

const log = Logger.create();

async function exec() {

    log.info("Running anki debug test code...");

    let body = {
        "action": "deckNamesAndIds",
        "version": 6
    };

    fetch('http://127.0.0.1:8765', { method: 'POST', body: JSON.stringify(body) })
        .then(res => res.json())
        .then(json => console.log(json));
}

exec()
    .then(() => log.info("done"))
    .catch(err => log.error("Failed: ", err));
