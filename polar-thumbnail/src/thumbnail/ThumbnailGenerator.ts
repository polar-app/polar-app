import {URLStr} from "polar-shared/src/util/Strings";

import puppeteer from 'puppeteer';
import {Files} from "polar-shared/src/util/Files";

export class ThumbnailGenerator {

    public static async generate(url: URLStr)  {

        const browser = await puppeteer.launch();
        console.log("FIXME1");
        const page = await browser.newPage();
        console.log("FIXME2");
        await page.goto('https://mozilla.github.io/pdf.js/web/viewer.html#zoom=page-height');
        console.log("FIXME3");
        await page.setViewport({width: 320, height: 480});
        console.log("FIXME4");

        await page.waitForNavigation({waitUntil : 'networkidle0'});
        console.log("FIXME5");

        const buff = await page.screenshot({path: 'digg.png', fullPage: true});
        console.log("FIXME6");

        await Files.writeFileAsync('/tmp/test.png', buff);

        await browser.close();

        // draw page to fit into 96x96 canvas
        //
        // const makeThumb = async (page: PDFPageProxy) => {
        //
        //     const vp = page.getViewport({scale: 1});
        //     //const canvas = document.createElement("canvas");
        //     const canvas = createCanvas(1024, 768);
        //     canvas.width = canvas.height = 96;
        //     const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        //
        //     const canvasContext = canvas.getContext("2d")!
        //
        //     await page.render({
        //         canvasContext,
        //         // viewport: page.getViewport(scale)
        //     }).promise;
        //
        //
        //
        // };
        //
        // const doc = await PDFJS.getDocument(url).promise;
        // const page = await doc.getPage(1);
        //
        // await makeThumb(page);

        //
        //
        //
        // var pages = []; while (pages.length < doc.numPages) pages.push(pages.length + 1);
        // return Promise.all(pages.map(function (num) {
        //     // create a div for each page and build a small canvas for it
        //     var div = document.createElement("div");
        //     document.body.appendChild(div);
        //     return doc.getPage(num).then(makeThumb)
        //         .then(function (canvas) {
        //             div.appendChild(canvas);
        //         });
        // }));

    }

}
