import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import StreamZip from 'node-stream-zip';
import {getXmlToJSON} from "./util/getXmlToJSON";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import path from "path";

interface IEPUBRootFile {
    /**
     * Root file name
     */
    readonly name: string;

    /**
     * Root file contents converted to JSON
     */
    readonly contents: IEPUBRoot;
}

interface IEPUBRootFileXML {
    readonly rootFile: string;
    readonly rootFileData: string;
}
interface IEPUBRoot {
    readonly package: {
        readonly metadata: {
            readonly [key: string]: any;
        };
        readonly spine: ISpine;
        readonly manifest: IManifest;
    }
}


interface IManifest {
    readonly item: ReadonlyArray<IManifestItem>;
}
interface IManifestItem {
    readonly '@_id': string;
    readonly '@_href': string;
    readonly '@_media-type': string;
    readonly '@_properties'?: string;
}
export interface ISpine {
    readonly itemref: ReadonlyArray<ISpineRef>;
}

export interface ISpineRef {
    readonly '@_idref': string;
    readonly '@_linear': "yes" | "no";
}

const getMetadataFieldFromSpine = (rootFile: IEPUBRoot, name: string) => rootFile.package.metadata[`dc:${name}`];

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
            .filter((ref: ISpineRef) => ref['@_linear'] === 'yes')
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
    public static async getChapterReferences(epubFile: PathOrURLStr): Promise<readonly IChapterReference[]> {
        const rootFile = await this.getRootFile(epubFile);
        const rootFileAsJSON = rootFile.contents;
        const pathToRootFile = path.parse(rootFile.name).dir;

        // References to the list of chapters within the epub, in a very simple structure
        const chapterReferences = rootFileAsJSON.package.spine.itemref
            .filter((val: ISpineRef) => val['@_linear'] === 'yes');

        // Convert the single structure of chapters to one that makes more sense and is richer
        return chapterReferences.map((item: ISpineRef) => {
            // Pointer to an ID within the root.package.manifest.item array
            const idref = item['@_idref'];

            // Find that full object, based on the `idref` above
            const fullObj = rootFileAsJSON.package.manifest.item
                .find((val: IManifestItem) => val['@_id'] === idref);

            // handles edge case of failing to find spine ID Ref 
            // in package manifest
            if (!fullObj) {
                return {
                    id: idref,
                    file: idref
                };
            }

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

    public static getZip(docPathOrURL: PathOrURLStr) {
        // eslint-disable-next-line new-cap
        return new StreamZip.async({
            file: docPathOrURL,
            storeEntries: true,
        });
    }

    private static async getRootFile(docPathOrURL: string): Promise<IEPUBRootFile> {
        const { rootFile, rootFileData } = await this.getRootFileXML(docPathOrURL);

        const rootFileAsJSON = getXmlToJSON(rootFileData.toString()) as IEPUBRoot;

        return {
            name: rootFile,
            contents: rootFileAsJSON,
        };
    }

    public static async getRootFileXML(docPathOrURL: string): Promise<IEPUBRootFileXML> {
        const zip = this.getZip(docPathOrURL);

        const data = await zip.entryData('META-INF/container.xml');

        const rootFile = getXmlToJSON(data.toString())
            .container
            .rootfiles
            .rootfile['@_full-path'];

        const rootFileData = await zip.entryData(rootFile);

        await zip.close();

        return {
            rootFile: rootFile,
            rootFileData: rootFileData.toString()
        };
    }
}

export interface IChapterReference {
    readonly id: string, // e.g. "chapter_003"
    readonly file: string, // e.g. "chapter_003.xhtml"
}
