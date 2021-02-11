import {v4 as uuid} from 'uuid';
import {CIDProviders} from './CIDProviders';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {CIDProvider} from './CIDProvider';
import {isPresent} from 'polar-shared/src/Preconditions';

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

    private static fetch(): string | undefined {

        const mainCID = Optional.of(CIDProviders.getInstance())
            .filter(current => isPresent(current))
            .map(current => current.get())
            .getOrUndefined();

        const localCID = window.localStorage.getItem(KEY);

        // log.debug(`mainCID: ${mainCID}, localCID: ${localCID}`);

        return Optional.first(mainCID, localCID).getOrUndefined();

    }

    private static set(cid: string) {
        window.localStorage.setItem(KEY, cid);
        CIDProviders.setInstance(new CIDProvider(cid));
    }

    private static create(): string {
        // The cid must be UUID v4, using a UUID v1 will not work, the doc is
        // misleading there because it states that it should use v4, not that it
        // must. Google doesn't handle the v1 and generates its own uuid which
        // messes totally the whole thing.
        return uuid();
    }

}
