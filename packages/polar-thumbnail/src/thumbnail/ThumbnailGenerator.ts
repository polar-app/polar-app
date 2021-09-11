import {URLStr} from "polar-shared/src/util/Strings";

import puppeteer from 'puppeteer';

export class ThumbnailGenerator {

    public static async generate(url: URLStr)  {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://mozilla.github.io/pdf.js/web/viewer.html#zoom=page-height');
        await page.setViewport({width: 850, height: 1100});

        await page.waitForNavigation({waitUntil : 'networkidle0'});

        await page.addStyleTag({
            content: "#viewerContainer { top: 0; } .toolbar { display: none; } #viewer :not(:first-child) { display: none; }"
        });

        // await Promises.waitFor(5000);

        // NOTE that we can specify a path and write to the FS directly.
        const buff = await page.screenshot({fullPage: false});

        await browser.close();

        return buff;

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
