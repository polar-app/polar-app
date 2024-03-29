import {XHTMLWrapper} from "polar-epub-generator/src/XHTMLWrapper";
import {EPUBGenerator} from "polar-epub-generator/src/EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {URLs} from "polar-shared/src/util/URLs";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";
import {URLStr} from "polar-shared/src/util/Strings";
import {ExtensionContentCapture} from "../capture/ExtensionContentCapture";
import { JSDOM } from "jsdom";
export namespace CapturedContentEPUBGenerator {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    import LocalImage = EPUBGenerator.LocalImage;

    async function toLocalImage(url: URLStr,
                                img: HTMLImageElement): Promise<LocalImage | undefined> {

        const src = img.getAttribute('src');

        if (src === null) {
            return undefined;
        }

        // ID for the image...
        const id = Hashcodes.createRandomID();

        const basename = URLs.basename(src);
        const ext = FilePaths.toExtension(basename).getOrUndefined();
        const newSrc = id + (ext ? `.${ext}` : '');

        const hrefAbsolute = URLs.absolute(src, url);

        try {
            const blob = await URLs.toBlob(hrefAbsolute);

            return {
                id,
                img,
                src,
                newSrc,
                blob,
                mediaType: blob.type
            };

        } catch (e) {
            console.error("Unable to store image locally: " + url, e);
            return undefined;
        }

    }

    function convertDocumentToLocalImages(localImages: ReadonlyArray<LocalImage>) {

        function convertHREFs() {

            // update the internal src href so that it can load from the epub
            // and not the original URL
            for (const localImage of localImages) {
                localImage.img.setAttribute('data-original-src', localImage.src)
                localImage.img.setAttribute('src', localImage.newSrc);
            }

        }

        function toEPUBImage(local: LocalImage): EPUBGenerator.EPUBImage {
            return {
                id: local.id,
                src: local.newSrc,
                data: local.blob,
                mediaType: <EPUBGenerator.MediaType> local.mediaType
            };
        }

        convertHREFs();
        return localImages.map(toEPUBImage)

    }

    function convertToHumanReadableContent(capture: ICapturedEPUB) {

        function createFigure() {

            if (capture.image) {
                return `<figure><img src="${capture.image}" alt="${capture.title}"></figure>`;
            }

            return "";

        }

        function createH1() {
            return `<h1>${capture.title}</h1>`;
        }

        function createH2() {

            if (capture.description) {
                return `<h2>${capture.title}</h2>`;
            }

            return "";

        }

        const figure = createFigure();
        const h1 = createH1();
        const h2 = createH2();


        return `<div>
            <header>
                ${h1}
                ${h2}
                ${figure}
            </header>
            <main>
                ${capture.content}
            </main>
            </div>`;

    }

    async function convertToEPUBDocument(capture: ICapturedEPUB) {
        let { title } = capture;

        // Rare cases where a captured page doesn't have a title tag..
        if (!title) {
            title = "";
        }

        const readableContent = convertToHumanReadableContent(capture);

        function getDocument(): Document {
            if (typeof window === 'undefined') {
                return new JSDOM(readableContent).window.document;
            } else {
                return new DOMParser().parseFromString(readableContent, "text/html");
            }
        }

        const contentDoc = getDocument();

        const imgs = Array.from(contentDoc.querySelectorAll('img'));

        const localImages =
            await asyncStream(imgs)
                .map(current => toLocalImage(capture.url, current))
                .filter(current => current !== undefined)
                .map(current => current!)
                .collect();

        const images = convertDocumentToLocalImages(localImages);

        const coverImage = localImages.find(img => img.src === capture.image);

        const localContent = contentDoc.documentElement.outerHTML;
        const data = XHTMLWrapper.wrap({title, content: localContent});

        const doc: EPUBGenerator.EPUBDocument = {
            title,
            url: capture.url,
            cover: coverImage,
            conversion: ISODateTimeStrings.create(),
            contents: [
                {
                    id: 'index.html',
                    href: 'index.html',
                    mediaType: 'application/xhtml+xml',
                    title,
                    data,
                    images
                }
            ]
        }

        return doc;

    }

    export async function generate(capture: ICapturedEPUB): Promise<ArrayBuffer> {
        const doc = await convertToEPUBDocument(capture);
        return await EPUBGenerator.generate(doc);
    }

}
