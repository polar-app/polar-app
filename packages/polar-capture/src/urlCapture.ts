import { JSDOM } from "jsdom";
import { ReadabilityCapture } from "polar-web-capture/src/capture/ReadabilityCapture";
import { CapturedContentEPUBGenerator } from "polar-web-capture/src/captured/CapturedContentEPUBGenerator";
import fetch, { Response } from 'node-fetch';
import { FileUpload } from './fileUpload';
import { Readable } from 'stream';
import { File } from '@google-cloud/storage';

export namespace UrlCapture {
    export const MAX_CONTENT_LENGTH = 104857600; // 100 MiB

    export async function fetchUrl(url: string): Promise<File> {
        const response = await fetch(url);

        validateResponse(response);

        if (response.headers.get('content-type') === "application/pdf") {
            return await writeTmpPdf(response);
        } else {
            return await writeTmpEpub(response);
        }
    }

    async function writeTmpPdf(response: Response): Promise<File> {
        const { file, uploadStream } = await FileUpload.init('pdf');

        let contentLength = 0;

        async function writeStream(): Promise<void> {
            return await new Promise((resolve, reject) => {

                response.body.pipe(uploadStream);

                response.body.on("data", data => {
                    contentLength += data.length
                    validateContentLength(contentLength);
                });
                
                uploadStream.on("error", (error) => {
                    reject(error);
                });

                uploadStream.on('finish', () => {
                    uploadStream.end();
                    resolve();
                });
            });
        }
        
        await writeStream();

        return file;
    }
    async function writeTmpEpub(response: Response): Promise<File> {
        const { file, uploadStream } = await FileUpload.init('epub');

        const html = await response.text();

        const epub = await generateEPUB(html, response.url);

        async function writeStream(): Promise<void> { 
            return await new Promise((resolve, reject) => {
                const stream = new Readable();
                stream.push(Buffer.from(epub));
                stream.push(null);

                stream.pipe(uploadStream);

                uploadStream.on("error", (error) => {
                    reject(error);
                });

                uploadStream.on('finish', () => {
                    uploadStream.end();
                    resolve();
                });
            });
        }

        await writeStream();

        return file;
    }

    /**
     * validates capture response if it included a content-length header
     * 
     */
    function validateResponse(response: Response): void {
        const contentLength = response.headers.get('Content-Length');

        if (contentLength !== null) {
            validateContentLength(parseInt(contentLength));
        }
    }

    function validateContentLength(contentLength: number): void 
    {
        if (contentLength > MAX_CONTENT_LENGTH) {
            throw new Error("Content exceeds maximum length");
        }
    }

    export async function generateEPUB(html: string, url: string): Promise<ArrayBuffer> {
        const dom = new JSDOM(html);
        
        const doc = <Document> dom.window.document;

        const epubCapture = ReadabilityCapture.extractCapturedEPUB(doc, url);

        return await CapturedContentEPUBGenerator.generate(epubCapture);
    }
}