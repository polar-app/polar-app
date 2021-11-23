import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";
import { CapturedContentEPUBGenerator } from "polar-web-capture/src/captured/CapturedContentEPUBGenerator";
import fetch from 'node-fetch';
import { writeFileSync, mkdtempSync} from "fs";
import { EPUBMetadataUsingNode } from "polar-epub/src/EPUBMetadataUsingNode";
import { PDFMetadata } from "polar-pdf/src/pdf/PDFMetadata";
export namespace urlCapture {

    type CaptureType = 'pdf' | 'epub';

    const PDF_TYPE = "application/pdf";


    export async function fetchUrl(url: string): Promise<void> {
        const response = await fetch(url);

        let path;
        
        if (response.headers.get('content-type') === PDF_TYPE) {
            const pdf = await response.arrayBuffer();

            path = writeTempFile(pdf, 'pdf');
            
            console.log(await PDFMetadata.getMetadata(path));
        } else {
            const epub = await generateEPUB(await response.text(), url);

            path = writeTempFile(epub, 'epub');
            
            console.log(await EPUBMetadataUsingNode.getMetadata(path));
        }
    }

    function writeTempFile(arrayBuffer: ArrayBuffer, type: CaptureType): string {
        const file = new Uint8Array(arrayBuffer);

        const relativePath = mkdtempSync('temp-') + `temp.${type}`

        writeFileSync(relativePath, file);

        return `${__dirname}/../${relativePath}`;
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