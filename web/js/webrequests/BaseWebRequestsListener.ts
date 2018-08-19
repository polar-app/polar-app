import {NamedWebRequestEvent, WebRequestReactor} from './WebRequestReactor';
import {Logger} from '../logger/Logger';

const log = Logger.create();


/**
 * Allows us to listen to all web requests and also register ourselves multiple
 * times.  The Electron WebRequests API says it's an EventEmitter but it's not
 * and addListener doesn't work so we had to add these ourselves.
 *
 */
export class BaseWebRequestsListener {

    constructor() {
    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    onWebRequestEvent(event: NamedWebRequestEvent) {

    }

    /**
     *
     */
    register(webRequestReactor: WebRequestReactor) {
        webRequestReactor.register(this.onWebRequestEvent.bind(this));
    }

}
