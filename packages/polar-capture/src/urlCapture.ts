import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";
import { CapturedContentEPUBGenerator } from "polar-web-capture/src/captured/CapturedContentEPUBGenerator";
import fetch, { Response } from 'node-fetch';
import { FileUpload } from './fileUpload';
export namespace UrlCapture {

    type CaptureType = 'pdf' | 'epub';

    const PDF_TYPE = "application/pdf";

    export const MAX_CONTENT_LENGTH = 104857600; // 100 MiB

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
            if (parseInt(contentLength) > UrlCapture.MAX_CONTENT_LENGTH) {
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