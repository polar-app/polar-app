import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";
import {ImageDatas} from "polar-shared/src/util/Canvases";

async function doAsync() {

    const thumbnail = await PDFThumbnailer.generate2('../../docs/example.pdf')

    console.log(`FIXME: generated thumbnail of type: ${thumbnail.type}, width: ${thumbnail.width}, height: ${thumbnail.height}`);

    console.log(thumbnail);

    const dataURL = ImageDatas.toDataURL(thumbnail);
    console.log(dataURL);

}



doAsync().catch(err => console.error(err));
