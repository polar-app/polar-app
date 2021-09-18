import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import StreamZip from 'node-stream-zip';
import {getXmlToJSON} from "./util/getXmlToJSON";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import path from "path";

const getMetadataFieldFromSpine = (spine: {
    package: {
        metadata: {
            [key: string]: any,
        }
    }
}, name: string) => spine.package.metadata[`dc:${name}`];

export class EPUBMetadataUsingNode {

    public static async getMetadata(epubFile: PathOrURLStr): Promise<IParsedDocMeta> {
        const rootFile = await this.getRootFile(epubFile);
        const rootFileAsJSON = rootFile.contents;

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
            .filter((ref: { [x: string]: any; }) => ref['@_linear'] === 'yes')
            .length;

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

    /**
     * Resolve a flat array of chapters within an epub file in a format like:
     * {
     *     id: string - ID of the chapter
     *     file: string - path to that chapter within the epub
     * }
     *
     * On how to use the returned `file` paths:
     * @see getChapterContents()
     */
    public static async getChapterReferences(epubFile: PathOrURLStr): Promise<IChapterReference[]> {
        const rootFile = await this.getRootFile(epubFile);
        const rootFileAsJSON = rootFile.contents;
        const pathToRootFile = path.parse(rootFile.name).dir;

        // References to the list of chapters within the epub, in a very simple structure
        const chapterReferences = rootFileAsJSON.package.spine.itemref
            .filter((val: { [x: string]: string; }) => val['@_linear'] === 'yes');

        // Convert the single structure of chapters to one that makes more sense and is richer
        return chapterReferences.map((item: any) => {
            // Pointer to an ID within the root.package.manifest.item array
            const idref = item['@_idref'];

            // Find that full object, based on the `idref` above
            const fullObj = rootFileAsJSON.package.manifest.item
                .find((val: { [x: string]: any; }) => val['@_id'] === idref);

            // Return the ID and the pointer to the file within the epub zip

            return {
                id: idref,
                file: `${pathToRootFile}/${fullObj['@_href']}`,
            };
        });
    }

    /**
     * Given an epub file and a path to a chapter HTML file within that file,
     * returns the raw HTML contents of that chapter
     *
     * @param epubFile
     * @param chapterPath
     */
    static async getChapterContents(epubFile: PathOrURLStr, chapterPath: string) {
        const zip = this.getZip(epubFile)
        return await zip.entryData(chapterPath);
    }

    private static getZip(docPathOrURL: PathOrURLStr) {
        return new StreamZip.async({
            file: docPathOrURL,
            storeEntries: true,
        });
    }

    private static async getRootFile(docPathOrURL: string) {
        const zip = this.getZip(docPathOrURL)

        const data = await zip.entryData('META-INF/container.xml');

        const rootFile = getXmlToJSON(data.toString())
            .container
            .rootfiles
            .rootfile['@_full-path'];

        const rootFileData = await zip.entryData(rootFile);

        const rootFileAsJSON = getXmlToJSON(rootFileData.toString());

        await zip.close();
        return {
            name: rootFile,
            contents: rootFileAsJSON,
        };
    }
}

interface IChapterReference {
    id: string, // e.g. "chapter_003"
    file: string, // e.g. "chapter_003.xhtml"
}
