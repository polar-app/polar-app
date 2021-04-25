import {Fetches, RequestInit} from 'polar-shared/src/util/Fetch';
import {AnkiConnectResponse} from './AnkiConnectResponse';
import {Logger} from 'polar-shared/src/logger/Logger';
import { AnkiSyncError } from './AnkiSyncError';

const log = Logger.create();

/**
 * Fetch implementation that always uses the proper Anki local URL.
 */
export class AnkiConnectFetch {

    /**
     * The ports to connect to.. we used to try on 8765 (Anki Connect) and 8766 (Polar Connect)
     * but now just Anki Connect.
     */
    public static PORTS = [8765];

    private static port: number = 8765;

    public static async initialize(): Promise<any> {

        // try to determine which port to use based on polar connect vs anki connect
        const detectPort = async (): Promise<number> => {

            for (const port of this.PORTS) {

                try {

                    const body = {
                        action: "version",
                        version: 6,
                        params: {}
                    };

                    const init = { method: 'POST', body: JSON.stringify(body) };

                    await AnkiConnectFetch.fetch(init, port);

                    return port;

                } catch (e) {
                    console.error("Unable to connect on port: " + port, e);
                }

            }

            const msg = `Unable to connect to anki with ports ${this.PORTS} (make sure Anki Connect is installed)`;
            log.error(msg);
            throw new AnkiSyncError(msg, 'no-anki-connect');

        };

        const configurePort = async () => {

            this.port = await detectPort();
            log.notice("Using Anki sync port: "  + this.port);

        };

        await configurePort();

    }

    // TODO: since the response is wrapped in a closure, we can handle errors
    // properly here.
    public static async fetch(init: RequestInit, port: number = this.port): Promise<any> {

        try {

            init = {
                ...init,
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            const response = await Fetches.fetch('http://127.0.0.1:' + port, init);
            const result: AnkiConnectResponse = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            return result.result;
        } catch (e) {
            log.warn("Anki connect fetch failed (install Anki Connect): ", e);
            throw e;
        }

    }

}
