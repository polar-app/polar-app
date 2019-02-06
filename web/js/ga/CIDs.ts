import {v4 as uuid} from 'uuid';
import {remote} from 'electron';
import {Provider} from '../util/Providers';
import {CIDProviders} from './CIDProviders';
import {Optional} from '../util/ts/Optional';
import {CIDProvider} from './CIDProvider';
import {Logger} from '../logger/Logger';

const log = Logger.create();

declare var window: Window;

const KEY = 'ga_cid';

export class CIDs {

    /**
     * Get a unique CID from localStorage.
     */
    public static get(): string {

        let cid = this.fetch();

        if (! cid) {
            cid = this.create();
        }

        // always set it back so that the value is copied into main.
        this.set(cid);

        return cid;

    }

    private static fetch() {

        const mainCID = Optional.of(CIDProviders.getInstance())
            .map(cidProvider => cidProvider.get())
            .getOrUndefined();

        const localCID = window.localStorage.getItem(KEY);

        log.debug(`mainCID: ${mainCID}, localCID: ${localCID}`);

        return Optional.first(mainCID, localCID).get();

    }

    private static set(cid: string) {
        window.localStorage.setItem(KEY, cid);
        CIDProviders.setInstance(new CIDProvider(cid));
    }

    private static create(): string {
        return uuid();
    }

}
