import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";

async function doAsync() {
    const thumbnail = await PDFThumbnailer.generate2('../../docs/example.pdf')

    console.log("FIXME: generated thumbnail of type: " + thumbnail.type);
    console.log(thumbnail);
}

doAsync().catch(err => console.error(err));
