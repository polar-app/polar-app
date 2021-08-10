import {JSDOM} from "jsdom";
const dom = new JSDOM(``, {url: 'https://www.example.com'});
global.document = dom.window.document;
(global as any).window = dom.window;
(global as any).localStorage = dom.window.localStorage;
(global as any).navigator = dom.window.navigator;
(global as any).performance = dom.window.performance;
(global as any).window.requestAnimationFrame = (delegate: () => void) => setTimeout(() => delegate(), 1);

import {PDFThumbnailer} from "./PDFThumbnailer";
import { createCanvas} from 'canvas';

describe('PDFThumbnailer', async function() {

    this.timeout(999999);

    it('basic', async function () {

        const canvasFactory = () => createCanvas(612, 792) as any;
        const containerFactory = () => dom.window.document.createElement('div');

        // Request URL:

        const thumbnail = await PDFThumbnailer.generate({
            pathOrURL: "https://storage.googleapis.com/polar-32b0f.appspot.com/stash/12XTZBtjiJUu9XcVChpKnfberQcjQNLWoGbGS7AF.pdf",
            scaleBy: "width",
            value: 200,
            canvasFactory,
            containerFactory
        });

        console.log(thumbnail);

    });

});
