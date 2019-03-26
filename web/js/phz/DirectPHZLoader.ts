/**
 * Loads PHZs directly by opening them, decompressing them, and parsing the HTML
 * and then replacing the iframes directly.
 */
import {PathStr} from '../util/Strings';
import {URLStr} from '../util/Strings';
import {URLs} from '../util/URLs';
import {PHZReader} from './PHZReader';
import {Logger} from '../logger/Logger';
import {Captured} from '../capture/renderer/Captured';
import {Resources} from './Resources';
import {Reducers} from '../util/Reducers';
import {Blobs} from '../util/Blobs';
import {ResourceEntry} from './ResourceEntry';

const log = Logger.create();

export class DirectPHZLoader {

    public static async load(resource: PathStr | URLStr) {

        console.log("FIXME2");

        const toPHZReader = async () => {

            const phzReader = new PHZReader();

            if (URLs.isURL(resource)) {

                const response = await fetch(resource);
                const blob = await response.blob();

                await phzReader.init(blob);

            } else {
                // this is a path string.
                await phzReader.init(resource);
            }

            return phzReader;

        };

        const phzReader = await toPHZReader();

        const metadata = await phzReader.getMetadata();

        if (metadata) {
            const resources = await phzReader.getResources();

            const url = metadata.url;

            await this.loadDocument(phzReader, url, resources);

        } else {
            console.log("FIXME4");

            log.warn("Document has no metadata: " + resource);
        }


    }

    private static async loadDocument(phzReader: PHZReader,
                                      url: string,
                                      resources: Resources) {

        const primaryResource = Object.values(resources.entries)
            .filter(current => current.resource.url === url)
            .reduce(Reducers.FIRST);

        if (primaryResource) {

            const iframe = <HTMLIFrameElement> document.getElementById('content');
            await this.loadResource(phzReader, primaryResource, iframe);

        } else {
            console.log("FIXME5");
            log.warn("No primary resource found for: " + url);
        }

    }

    private static async loadResource(phzReader: PHZReader,
                                      resourceEntry: ResourceEntry,
                                      iframe: HTMLIFrameElement) {

        const blob = await phzReader.getResourceAsBlob(resourceEntry);

        // now that we have the blob, which should be HTML , parse it into
        // its own document object.

        const str = await Blobs.toText(blob);

        const doc = new DOMParser().parseFromString(str, 'text/html');

        const iframes = this.neutralizeIFrames(doc);

        iframe.contentDocument!.documentElement!.replaceWith(doc.documentElement!);

        // FIXME: now we need to cleanup here and:
        // fix the iframe resources
        // the target properly...

    }

    /**
     * Al through all the iframes in this doc and fix them so that they don't
     * load as we are going to load them manually.
     */
    private static neutralizeIFrames(doc: Document) {

        const result: IFrameRef[] = [];

        for (const iframe of Array.from(doc.querySelectorAll("iframe"))) {

            const src = iframe.getAttribute("src");

            if (src) {

                iframe.setAttribute("data-loader-src", src);
                iframe.removeAttribute("src");

                result.push({iframe, src});
                continue;

            } else {
                // this iframe isn't interesting to us as it does not have
                // a src attribute that we should be using.
            }

        }

    }


}

interface IFrameRef {
    readonly src: string;
    readonly iframe: HTMLIFrameElement;
}
