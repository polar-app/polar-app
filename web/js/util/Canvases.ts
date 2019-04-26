/**
 * Functions for working with canvas objects, extracting screenshots, etc.
 */
import {ArrayBuffers} from './ArrayBuffers';
import {ILTRect} from './rects/ILTRect';

const IMAGE_TYPE = 'image/png';
const IMAGE_QUALITY = 1.0;

export class Canvases {

    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/pdf-loader.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/extractor.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/debug-canvas.js

    /**
     * Take a canvas and convert it to a data URL without limitations on the
     * size of the URL.
     */
    public static async toDataURL(canvas: HTMLCanvasElement,
                                  opts: ImageOpts = new DefaultImageOpts()): Promise<string> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob

        const ab = await this.toArrayBuffer(canvas, opts);
        const encoded = ArrayBuffers.toBase64(ab);
        return `data:${IMAGE_TYPE};base64,` + encoded;

    }

    public static toArrayBuffer(canvas: HTMLCanvasElement,
                                opts: ImageOpts = new DefaultImageOpts()): Promise<ArrayBuffer> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob
        //
        return new Promise((resolve, reject) => {

            canvas.toBlob((blob) => {

                if (blob) {

                    const reader = new FileReader();

                    reader.addEventListener("onloadstart", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("loadend", () => {
                        const ab = <ArrayBuffer> reader.result;
                        resolve(ab);
                    });

                    reader.addEventListener("onerror", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("onabort", (err) => {
                        reject(err);
                    });

                    reader.readAsArrayBuffer(blob);

                } else {
                    reject(new Error("No blob"));
                }

            }, opts.type, opts.quality);

        });

    }

    /**
     * Extract image data from the given canvas directly and return it as an
     * array buffer.
     * @param canvas The canvas we should extract with.
     * @param rect The rect within the given canvas
     * @param opts The options for the image extraction
     */
    public static async extract(canvas: HTMLCanvasElement,
                                rect: ILTRect,
                                opts: ImageOpts = new DefaultImageOpts()): Promise<ExtractedImage> {

        const tmpCanvas = document.createElement("canvas");

        const tmpCanvasCtx = tmpCanvas.getContext('2d', {alpha: false})!;
        tmpCanvasCtx.imageSmoothingEnabled = false;

        tmpCanvas.width  = rect.width;
        tmpCanvas.height = rect.height;

        // copy data from the source canvas to the target
        tmpCanvasCtx.drawImage(canvas,
                               rect.left, rect.top, rect.width, rect.height,
                               0, 0, rect.width, rect.height);

        const data = await this.toArrayBuffer(tmpCanvas, opts);

        return {data, width: rect.width, height: rect.height, type: opts.type};

    }

}

/**
 * Keeps the binary data but also metadata for the extract.
 */
export interface ExtractedImage {
    readonly data: ArrayBuffer;
    readonly type: ImageType;
    readonly width: number;
    readonly height: number;
}

export type DataURL = string;

interface ImageOpts {
    readonly type: ImageType;
    readonly quality: number;

}

class DefaultImageOpts implements ImageOpts {
    public readonly type = IMAGE_TYPE;
    public readonly quality = IMAGE_QUALITY;
}

export type ImageType = 'image/png' | 'image/jpeg';
