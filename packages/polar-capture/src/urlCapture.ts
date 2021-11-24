import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";
import { CapturedContentEPUBGenerator } from "polar-web-capture/src/captured/CapturedContentEPUBGenerator";
import fetch, { Response } from 'node-fetch';
import { writeFileSync, mkdtempSync, createWriteStream } from "fs";
import { EPUBMetadataUsingNode } from "polar-epub/src/EPUBMetadataUsingNode";
import { PDFMetadata } from "polar-pdf/src/pdf/PDFMetadata";
import { FileUpload } from './fileUpload';
import { FirebaseAdminSecrets } from 'polar-firebase-admin/src/FirebaseAdminSecrets';
export namespace UrlCapture {

    type CaptureType = 'pdf' | 'epub';

    const PDF_TYPE = "application/pdf";

    const MAX_CONTENT_LENGTH = 104857600; // 100 MiB

    export async function fetchUrl(url: string): Promise<void> {
        const response = await fetch(url);

        checkContentLength(response);

        const { path, file, stream } = FileUpload.init();
        
        if (response.headers.get('content-type') === PDF_TYPE) {


            async function writeStream() {
                return await new Promise((resolve, reject) => {
                    response.body.pipe(stream);

                    response.body.on("error", (error) => {
                        reject(error);
                    });

                    stream.on('finish', () => {
                        stream.end();
                        resolve(null);
                    })
                    
                })
            }

            await writeStream();

            // console.log(await PDFMetadata.getMetadata(path));
        }
    }

    function checkContentLength(response: Response) {

        const contentLength = response.headers.get('Content-Length');

        if (contentLength !== null) {
            if (parseInt(contentLength) > MAX_CONTENT_LENGTH) {
                throw new Error("Content exceeds maximum length");
            }
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