import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import StreamZip from 'node-stream-zip';
import {getXmlToJSON} from "./util/getXmlToJSON";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

const getMetadataFieldFromSpine = (spine: any, name: string) => spine.package.metadata[`dc:${name}`];

export class EPUBMetadata {

    public static async getMetadata(docPathOrURL: PathOrURLStr): Promise<IParsedDocMeta> {

        // FIXME: Detect if the path is a relative file or an absolute URL and handle both cases
        const zip = new StreamZip.async({
            file: docPathOrURL,
            storeEntries: true,
        });

        const data = await zip.entryData('META-INF/container.xml');

        const rootFile = getXmlToJSON(data.toString())
            .container
            .rootfiles
            .rootfile['@_full-path'];

        const rootFileData = await zip.entryData(rootFile);

        const rootFileAsJSON = getXmlToJSON(rootFileData.toString());

        const creator = getMetadataFieldFromSpine(rootFileAsJSON, 'creator');
        const title = getMetadataFieldFromSpine(rootFileAsJSON, 'title');
        const description = getMetadataFieldFromSpine(rootFileAsJSON, 'description');
        const link = getMetadataFieldFromSpine(rootFileAsJSON, 'source');
        const doi = getMetadataFieldFromSpine(rootFileAsJSON, 'identifier')['#text'];
        const date = getMetadataFieldFromSpine(rootFileAsJSON, 'date');

        const id = `${doi}#${date}`;
        const fingerprint = Hashcodes.create(id);

        const nrPages = rootFileAsJSON.package.spine
            .itemref
            .filter((ref: { [x: string]: any; }) => ref['@_linear'] == 'yes')
            .length;

        // console.log(rootFileAsJSON.package);

        await zip.close();

        return {
            title: title,
            description,
            creator,
            doi,
            link,
            nrPages,
            props: {},
            fingerprint,
        }
    }
}
