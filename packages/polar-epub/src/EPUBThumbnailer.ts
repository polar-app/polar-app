import {ThumbnailerGenerateOpts, Thumbnailers} from "polar-shared/src/util/Thumbnailer";
import {EPUBDocs} from "./EPUBDocs";
import {Canvases} from "polar-shared/src/util/Canvases";
import {Images} from "polar-shared/src/util/Images";
import {Blobs} from "polar-shared/src/util/Blobs";
import {ImageTypes} from "polar-shared/src/util/ImageTypes";
import * as path from "path";
import StreamZip from "node-stream-zip";
import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {getXmlToJSON} from "./util/getXmlToJSON";

export namespace EPUBThumbnailer {

    export async function generate(opts: ThumbnailerGenerateOpts) {

        const book = await EPUBDocs.getDocument({url: opts.pathOrURL});

        const coverURL = await book.coverUrl();

        if (!coverURL) {
            return undefined;
        }

        const nativeDimensions = await Images.getDimensions(coverURL);

        const response = await fetch(coverURL);
        const blob = await response.blob();

        if (!ImageTypes.isImageType(blob.type)) {
            throw new Error("Type not accepted: " + blob.type);
        }

        const data = await Blobs.toArrayBuffer(blob);

        const scaledDimensions = Thumbnailers.computeScaleDimensions(opts, nativeDimensions);

        const imageData = await Canvases.arrayBufferToImageData(data, nativeDimensions, blob.type);

        try {
            const scaledImageData = await Canvases.resize(imageData.data, scaledDimensions)

            return {
                ...scaledImageData,
                scaledDimensions,
                nativeDimensions
            }
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    /**
     * Given a path to an epub file, try to resolve the path to its cover image
     * from the epub manifest and unzip that file to `targetPath`
     *
     * @param epubFilePath
     * @param coverTargetPath
     */
    export async function extractToFile(epubFilePath: PathOrURLStr, coverTargetPath: string,) {
        const zip = new StreamZip.async({
            file: path.resolve(__dirname, epubFilePath),
            storeEntries: true,
        });

        const data = await zip.entryData('META-INF/container.xml');

        const rootFile = getXmlToJSON(data.toString())
            .container
            .rootfiles
            .rootfile['@_full-path'];

        const rootFileData = await zip.entryData(rootFile);

        const rootFileAsJSON = getXmlToJSON(rootFileData.toString());
        const coverXmlElement = rootFileAsJSON.package.metadata.meta.find((el: { [x: string]: string; }) => el['@_name'] === 'cover');
        const coverId = coverXmlElement['@_content'];

        const coverPathRelativeToRootFile = rootFileAsJSON.package.manifest.item
            .map((item: { [x: string]: any; }) => {
                const id = item['@_id'];
                const href = item['@_href'];
                const properties = String(item['@_properties']);
                const hrefIsAnImage = (href.match(/^.*\.(jpg|jpeg|png)$/g) || []).length > 0;

                const itemIdMightBeCover = (id === coverId) || (id.includes('cover') && hrefIsAnImage);
                const itemPropertiesMightBeCover = (properties === coverId) || (properties.includes('cover') && hrefIsAnImage);

                return itemIdMightBeCover || itemPropertiesMightBeCover ? href : undefined;
            })
            .find((value: any) => !!value);

        const coverPathRelativeToEpubRoot = path.join(path.parse(rootFile).dir, coverPathRelativeToRootFile);

        if (!coverPathRelativeToEpubRoot) {
            await zip.close();
            throw new Error('@TODO Can not extract cover from this EPUB');
        }
        await zip.extract(coverPathRelativeToEpubRoot, coverTargetPath);

        await zip.close();
        return true;
    }
}
