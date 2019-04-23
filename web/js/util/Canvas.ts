/**
 * Functions for working with canvas objects, extracting screenshots, etc.
 */
import {ArrayBuffers} from './ArrayBuffers';
const IMAGE_TYPE = 'image/png';
const IMAGE_QUALITY = 1.0;

export class Canvases {

    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/pdf-loader.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/extractor.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/debug-canvas.js
    //
    // function fixCanvasImageSmoothing() {
    //
    //     // NOTE: this doesn't seem to actually change our output in any way.  The
    //     // content would change to a different image but it doesn't seem to. It
    //     // might be an ordering issue as the canvas could already be written to
    //     // but I don't think that's the issue.  To test whether this works we
    //     // can just toggle imageSmoothingEnabled and see if the content changes
    //     // on disk in our tests.
    //
    //     let canvas = document.querySelector("canvas");
    //
    //     if (! canvas) {
    //         return;
    //     }
    //
    //     let canvasCtx = canvas.getContext('2d');
    //
    //     canvasCtx.imageSmoothingEnabled = false;
    //
    // }

    public static toDataURLHD2(canvas: HTMLCanvasElement) {

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
                        const encoded = ArrayBuffers.toBase64(ab);
                        resolve(`data:${IMAGE_TYPE};base64,` + encoded);
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

            }, IMAGE_TYPE, IMAGE_QUALITY);

        });

    }


}

