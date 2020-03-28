import {isPresent} from "polar-shared/src/Preconditions";

export interface ShareData {

    readonly title?: string;
    readonly text?: string;
    readonly url?: string;

}

/**
 * Framework for sharing using the native share dialog from within PWAs.
 *
 * https://css-tricks.com/how-to-use-the-web-share-api/
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
 */
export class WebShares {

    public static async share(data: ShareData) {

        type ShareDelegate = (data: ShareData) => Promise<void>;

        const delegate: ShareDelegate = (<any> navigator).share;

        await delegate(data);

    }

    public static isSupported() {
        return isPresent((<any> navigator).share);
    }

}
