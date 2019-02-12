import {Blobs} from './Blobs';
import {ArrayBuffers} from './ArrayBuffers';
import {Strings} from './Strings';

// import fetch from './Fetch';

export class URLs {

    public static async toStream(url: string): Promise<Buffer> {

        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await Blobs.toArrayBuffer(blob);
        const buffer = ArrayBuffers.toBuffer(arrayBuffer);
        return buffer;

    }

    /**
     * Return true if the URL is a web scheme (http or https)
     * @param url
     */
    public static isWebScheme(url: string) {

        return url.startsWith('http:') || url.startsWith('https:');

    }

    /**
     * Get the site base URL including the scheme, domain, and optionally the
     * port.
     */
    public static toBase(url: string) {

        const parsedURL = new URL(url);

        const protocol = parsedURL.protocol;
        const hostname = parsedURL.hostname;
        const port = ! Strings.empty(parsedURL.port) ? `:${parsedURL.port}` : '';

        return `${protocol}//${hostname}${port}`;

    }

}
