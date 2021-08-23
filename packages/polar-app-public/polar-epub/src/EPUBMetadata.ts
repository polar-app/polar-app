import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import StreamZip from 'node-stream-zip';
import * as path from 'path';

const xmlParser = require('fast-xml-parser');

function getXmlToJSON(xml: string) {
    return xmlParser.parse(xml, {
        ignoreAttributes: false,
    });
}

async function getCoverFromManifest(docPathOrURL: PathOrURLStr, targetPath: string) {
    const zip = new StreamZip.async({
        file: path.resolve(__dirname, docPathOrURL),
        storeEntries: true,
    });

    // await zip
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
    await zip.extract(coverPathRelativeToEpubRoot, targetPath);

    await zip.close();
    return true;
}

export class EPUBMetadata {

    public static async getMetadata(docPathOrURL: PathOrURLStr): Promise<IParsedDocMeta> {

        console.log(docPathOrURL);
        console.log("FIXME: getDocument... ");

        await getCoverFromManifest(docPathOrURL, path.resolve(__dirname, 'target.jpg'));

        // @TODO Finish this
        return {
            creator: "",
            description: "",
            doi: "",
            fingerprint: "",
            link: "",
            nrPages: 0,
            props: {},
            title: ""
        }

        // const book = await EPUBDocs.getDocument({
        //     url: docPathOrURL,
        // });
        //
        // console.log("FIXME: getDocument... done");
        //
        // console.log("FIXME 0");
        // await book.ready;
        // console.log('isREADY');
        //
        // await book.opened;
        //
        // await book.ready;
        //
        // console.log("FIXME 1");
        // const metadata = await book.loaded.metadata;
        // console.log("FIXME 2");
        // const spine = await book.loaded.spine;
        // console.log("FIXME 3");
        //
        // if (!spine) {
        //     throw new Error("EPUB has no spine");
        // }
        //
        // const id = `${metadata.identifier}#${metadata.pubdate}`;
        // const fingerprint = Hashcodes.create(id);
        // const title = metadata.title;
        // const description = metadata.description;
        // const creator = metadata.creator;
        //
        // function computePages() {
        //     // epub.js has horrible types...
        //     const spineItems: ReadonlyArray<ISpineItem> = (<any>spine).spineItems;
        //     return spineItems.filter(current => current.linear);
        // }
        //
        // const pages = computePages();
        //
        // const nrPages = pages.length;
        //
        // return {
        //     fingerprint,
        //     title,
        //     description,
        //     creator,
        //     nrPages,
        //     props: {}
        // };

    }
}

interface ISpineItem {
    readonly idref: string;
    readonly linear: 'yes' | 'no';
}
