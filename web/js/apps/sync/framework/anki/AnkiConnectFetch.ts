import fetch, {RequestInit} from '../../../../util/Fetch';
import {AnkiConnectResponse} from './AnkiConnectResponse';
import {Logger} from '../../../../logger/Logger';

const log = Logger.create();

/**
 * Fetch implementation that always uses the proper Anki local URL.
 */
export class AnkiConnectFetch {

    public static PORTS = [8766, 8765];

    private static port: number = 8766;

    public static async initialize<T>(): Promise<any> {

        // try to determine which port to use based on polar connect vs anki connect

        for (const port of this.PORTS) {

            try {

                const body = {
                    action: "version",
                    version: 6,
                    params: {}
                };

                const init = { method: 'POST', body: JSON.stringify(body) };

                await AnkiConnectFetch.fetch(init, port);

                log.notice("Using Anki sync port: "  + port);

                this.port = port;

                return port;

            } catch (e) {
                log.debug("Unable to connect on port: " + port);
            }

        }

        log.error(`Unable to connect to anki with ports ${this.PORTS} (make sure Polar Connect is installed)`);

    }


    // TODO: since the response is wrapped in a closure, we can handle errors
    // properly here.
    public static async fetch<T>(init: RequestInit, port: number = this.port): Promise<any> {

        try {

            init = Object.assign({}, init);
            init.cache = 'no-cache';
            init.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            const response = await fetch('http://127.0.0.1:' + port, init);
            const result: AnkiConnectResponse = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            return result.result;
        } catch (e) {
            log.warn("Anki connect fetch failed (install Polar Connect or Anki Connect): ", e);
            throw e;
        }

    }

}
