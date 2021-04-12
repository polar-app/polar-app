import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";
import {Canvases, ImageDatas, ImageData} from "polar-shared/src/util/Canvases";

import "./index.scss"
import {Fetches} from "polar-shared/src/util/Fetch";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Blobs} from "polar-shared/src/util/Blobs";

function showImage(thumbnail: ImageData) {

    const dataURL = ImageDatas.toDataURL(thumbnail)
    const img = document.createElement('img');
    img.setAttribute('src', dataURL);
    img.setAttribute('height', '' + thumbnail.height);
    img.setAttribute('width', '' + thumbnail.width);

    document.body.appendChild(img);

}

async function doImageThumbnail() {

    const response = await fetch('./example.jpg')
    const blob = await response.blob();

    const ab = await Blobs.toArrayBuffer(blob);

    // FIXME we need to get the image dimensions
    const thumbnail = await Canvases.resize(ab, {width: 384, height: 255});
    showImage(thumbnail);


}

async function doAsync() {

    await doImageThumbnail();

    //
    //
    // console.log(thumbnail);
    //
    // const dataURL = ImageDatas.toDataURL(thumbnail);
    // console.log(dataURL);

}

doAsync().catch(err => console.error(err));
