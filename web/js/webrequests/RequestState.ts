import {Logger} from '../logger/Logger';

const log = Logger.create();

const STATE_STARTED = "STARTED";
const STATE_FINISHED = "FINISHED";

/**
 * Keep an index of the requests that are executing so that we can detect
 * problems with pending URLs.
 */
export class RequestState {

    private readonly map: {[id: number]: RequestEntry} = {};

    constructor() {
        log.info("Tracking request state...");
    }

    // check for double started and double finished too..

    markStarted(id: number, url: string) {

        let requestEntry: RequestEntry = {id, url, state: STATE_STARTED};

        if(id in this.map) {
            log.warn("Request was started but already present in map." + this.map[id]);
            return;
        }

        this.map[id] = requestEntry;

    }

    markFinished(id: number, url: string) {

        let requestEntry: RequestEntry = {id, url, state: STATE_FINISHED};

        if(! (id in this.map)) {
            log.warn("Request was marked finished but never marked started.");
            return;
        }

        if(this.map[id].state !== STATE_STARTED) {
            log.warn("Request was marked finished but is not currently started: " + this.map[id]);
            return;
        }

        this.map[id] = requestEntry;

    }

}

/**
 * Represents a request stored in the backing map.
 */
export interface RequestEntry {

    readonly id: number;
    readonly url: string;
    readonly state: string;

}
