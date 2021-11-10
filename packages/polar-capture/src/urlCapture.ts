import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";

export namespace urlCapture {
    export async function fetchDocument(url: string) {
        const dom = await JSDOM.fromURL(url);
        
        const doc = <Document> dom.window.document;

        console.log(ReadabilityCapture.extractCapturedEPUB(doc, url));
    }
}