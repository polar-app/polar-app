import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";
import Readability, { ParseResult } from "readability";
import {getMetadata, PageMetadata} from "polar-page-metadata-parser/src/parsers/PageParser";
import {ExtensionContentCapture} from "./ExtensionContentCapture";
import { JSDOM } from "jsdom";

export namespace ReadabilityCapture {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    interface CaptureParse {
        readonly readable: ParseResult;
        readonly metadata: PageMetadata;
    };

    function parseReadability(doc: Document) {
        const readability = new Readability(doc);
        return readability.parse();
    }

    function parseMetadata(doc: Document, url: string) {
        return getMetadata(doc, url);
    }

    async function fetchDocument(URL: string): Promise<Document> {
        const dom = await JSDOM.fromURL(URL);

        return <Document> dom.window.document;
    }

    function parseCapture(doc: Document, url: string) : CaptureParse {
        const readable = parseReadability(doc);

        const metadata = parseMetadata(doc, url);

        if (! readable) {
            throw new Error("Readability parse failed.");
        }

        if (! readable.content) {
            throw new Error("No readable content");
        }

        return {
            readable,
            metadata
        };
    }

    function extractCapturedEPUB(doc: Document, url: string) {
        const { readable, metadata } = parseCapture(doc, url);

        const sanitized = HTMLSanitizer.sanitizePortableDocument(readable.content);

        return {
            ...metadata,
            excerpt: readable.excerpt,
            text: readable.textContent,
            content: sanitized
        }
    }

    
    export function capture(): ICapturedEPUB {
        const url = document.location.href;

        const doc = <Document> document.cloneNode(true);

        return extractCapturedEPUB(doc, url);
    }

    export async function captureURL(URL: string): Promise<ICapturedEPUB> {
        const doc = await fetchDocument(URL);

        return extractCapturedEPUB(doc, URL);
    }
}
