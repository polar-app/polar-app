import {v4 as uuid} from 'uuid';

declare var window: Window;

export class CIDs {

    /**
     * Get a unique CID from localStorage.
     */
    public static get(): string {

        const key = 'ga_cid';

        let cid = window.localStorage.getItem(key);

        if (!cid) {
            cid = this.create();
            window.localStorage.setItem(key, cid);
        }

        return cid;

    }

    private static create(): string {
        return uuid();
    }

}
