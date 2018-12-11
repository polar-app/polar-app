import fetch, {RequestInit} from '../../../../util/Fetch';
import {AnkiConnectResponse} from './AnkiConnectResponse';
import {Logger} from '../../../../logger/Logger';

const log = Logger.create();

/**
 * Fetch implementation that always uses the proper Anki local URL.
 */
export class AnkiConnectFetch {

    // TODO: since the response is wrapped in a closure, we can handle errors
    // properly here.
    public static async fetch<T>(init: RequestInit): Promise<any> {

        try {

            init = Object.assign({}, init);
            init.cache = 'no-cache';
            init.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            const response = await fetch('http://127.0.0.1:8765', init);
            const result: AnkiConnectResponse = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            return result.result;
        } catch (e) {
            log.warn("Anki connect fetch failed: ", e);
            throw e;
        }

    }

}
