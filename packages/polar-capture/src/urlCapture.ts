import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";
import { CapturedContentEPUBGenerator } from "polar-web-capture/src/captured/CapturedContentEPUBGenerator";
import fetch from 'node-fetch';
export namespace urlCapture {
    const PDF_TYPE = "application/pdf";

    export async function fetchUrl(url: string): Promise<void> {
        const response = await fetch(url);

        if (response.headers.get('content-type') === PDF_TYPE) {
            for await (const chunk of response.body) {
                console.dir( chunk.toString() );
            }
        } else {
            generateEPUB(await response.text(), url);
        }
    }

    export async function generateEPUB(html: string, url: string): Promise<ArrayBuffer> {
        const dom = new JSDOM(html);
        
        const doc = <Document> dom.window.document;

        const epubCapture = ReadabilityCapture.extractCapturedEPUB(doc, url);

        return await CapturedContentEPUBGenerator.generate(epubCapture);
    }
}

export namespace storeCapture {
    export function saveCaptureAsPDF(blob: Blob, url: string) {
        // TODO: save blob in Datastore
    }

    export function saveCaptureAsEPUB() {
        // TODO: save generated epub
    }
}