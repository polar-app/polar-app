import {URLStr} from "polar-shared/src/util/Strings";
import { URLs } from "polar-shared/src/util/URLs";
import {Fetches} from "polar-shared/src/util/Fetch";
import ePub from "epubjs";
import { Files } from "polar-shared/src/util/Files";
import {Buffers} from "polar-shared/src/util/Buffers";
import {JSDOM} from "jsdom";

export namespace EPUBDocs {

    export interface Opts {
        readonly url: URLStr;
    }

    export async function getDocument(opts: Opts) {

        const dom = new JSDOM(``, {url: 'https://www.example.com'});
        global.document = dom.window.document;
        (global as any).window = dom.window;
        (global as any).localStorage = dom.window.localStorage;
        (global as any).navigator = dom.window.navigator;
        (global as any).performance = dom.window.performance;
        (global as any).window.requestAnimationFrame = (delegate: () => void) => setTimeout(() => delegate(), 1);

        // async function toArrayBuffer() {

        //     if (URLs.isURL(opts.url)) {
        //
        //         const docURL = await URLs.toURL(opts.url);
        //
        //         // we have to convert the URL to an ArrayBuffer otherwise epub
        //         // gets confused and tries to load this incorrectly with epubs.
        //         //
        //         // TODO: we should have a progress listener here ...
        //
        //         const response = await Fetches.fetch(docURL)
        //         return await response.arrayBuffer();
        //
        //     } else {
        //         const buff = await Files.readFileAsync(opts.url);
        //         return Buffers.toArrayBuffer(buff);
        //     }
        //
        // }
        //
        // const arrayBuffer = await toArrayBuffer();
        return ePub(opts.url);

    }

}
