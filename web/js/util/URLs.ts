import {Blobs} from './Blobs';
import {ArrayBuffers} from './ArrayBuffers';
import {Strings} from './Strings';

// import fetch from './Fetch';

export class URLs {

    public static async toBuffer(url: string): Promise<Buffer> {

        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await Blobs.toArrayBuffer(blob);
        return ArrayBuffers.toBuffer(arrayBuffer);

    }

    public static async toBlob(url: string): Promise<Blob> {

        const response = await fetch(url);

        if (response.ok) {
            return await response.blob();
        } else {
            throw new Error(`Could not fetch URL ${response.status}: ${response.statusText}`);
        }

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

    public static absolute(url: string, base: string) {
        return new URL(url, base).toString();
    }

    /**
     * Return true if this is a URL
     */
    public static isURL(path: string) {

        if (!path) {
            return false;
        }

        return path.startsWith("file:") ||
            path.startsWith("blob:") ||
            path.startsWith("http:") ||
            path.startsWith("https:");

    }

}
