import { EPUBMetadataUsingNode, IChapterReference, ISpine } from './EPUBMetadataUsingNode';
import {JSDOM} from "jsdom"
import { getXmlToJSON } from './util/getXmlToJSON';
interface IEPUBContent {
    /**
     * Chapter reference ID
     * e.g.: "titlepage"|"chapter_001"|etc..
     */
    readonly id: string;

    /**
     * Shared part of the CFI string that is generated from the XML root file
     * for each page.
     */
    readonly sharedCfi: string;
    /**
     * HTML string of the page
     */
    readonly html: () => Promise<string>;
};  

interface IEPUBText {
    /**
     * EPUB method of linking to specific content
     * think of an anchor tag but for epubs.
     * 
     * Full spec reference:
     * http://idpf.org/epub/linking/cfi/epub-cfi.html
     * 
     */
    readonly cfi: string;

    /**
     * Parsed text
     * 
     */
    readonly text: string;
};
export namespace EPUBContent {
    export async function get(filePath: string): Promise<ReadonlyArray<IEPUBContent>> {
        const results: IEPUBContent[] = [];
    
        const zip = EPUBMetadataUsingNode.getZip(filePath);

        try {
            const refs = await EPUBMetadataUsingNode.getChapterReferences(filePath);

            for (const ref of refs) {
                results.push({
                    id: ref.id,
                    sharedCfi: await generateCFIXMLFragment(filePath, ref.id),
                    html: () => extractChapterHtml(filePath, ref)
                });
            }
        } catch(e) {
            console.error(e);

            throw new Error(`Failed to read EPUB content from the following path: ${filePath}`);
        } finally {
            await zip.close();
        }

        return results as ReadonlyArray<IEPUBContent>;
    }

    async function extractChapterHtml(filePath: string, ref: IChapterReference): Promise<string> {
        const zipPage = EPUBMetadataUsingNode.getZip(filePath);

        try {
            const entry = await zipPage.entryData(ref.file); 
            
            const html = entry.toString('utf-8');

            return html;
        } catch (e) {
            console.error(e);
            
            throw new Error(`Failed to read chapter of id: ${ref.id}`);
        } finally {
            await zipPage.close();
        }
    }
    
    /**
     * 
     * parse html content of an EPUB page/chapter
     * 
     */
    export async function parseContent(content: IEPUBContent): Promise<ReadonlyArray<IEPUBText>> {
        const dom = new JSDOM(await content.html());

        const results: IEPUBText[] = [];

        let rootEvenIndex = 0;

        dom.window.document.documentElement.childNodes.forEach((node) => {
            if (node.nodeType === node.ELEMENT_NODE) {
                rootEvenIndex += 2;
                if (node.nodeName !== 'HEAD') {
                    parseChildren(node,`${content.sharedCfi}/${rootEvenIndex}`, results);
                }
            }
        });

        return results as ReadonlyArray<IEPUBText>;
    }

    /**
     * 
     * Recusively finds child nodes with extract its text contents 
     * and generates a CFI step relevant to it's parent
     * 
     */
    function parseChildren(node: ChildNode, nodePath: string, results: IEPUBText[]): void {
        if (node.hasChildNodes()) {

            let CFIEvenIndex = 0;

            node.childNodes.forEach((node) => {

                // Extracts text child contents if it had any
                if (node.nodeType === node.TEXT_NODE) {
                    const text = <string> node.nodeValue?.trim();

                    if (text.length !== 0) {
                        results.push({
                            cfi: wrapCFIPath(nodePath),
                            text: text
                        });
                    }
                }

                // Parse child element 'grand children' in-order
                if (node.nodeType === node.ELEMENT_NODE) {
                    CFIEvenIndex += 2;
                    parseChildren(node, `${nodePath}/${CFIEvenIndex}`, results);
                }
            
            });
        }
    }

    /**
     * 
     * @param rootFilePath epub file
     * @param idRef spine 'idref' attribute value 
     * @returns string CFI fragment of the XML chapter path ending with a step indirection '!'
     * - http://idpf.org/epub/linking/cfi/epub-cfi.html#sec-path-indirection
     */
    export async function generateCFIXMLFragment(rootFilePath: string,
                                                 idRef: string): Promise<string> {
        const rootFile = await EPUBMetadataUsingNode.getRootFileXML(rootFilePath);

        const xmlDOM = new JSDOM(rootFile.rootFileData, { 
            contentType: "text/xml"
        });

        let rootSpineIndex = 0;

        let CFIRootEvenIndex = 0;
        
        let spineNode = <HTMLElement> {};

        const rootChildren = Array.from(xmlDOM.window.document.documentElement.childNodes);


        for (const node of rootChildren) {
            
            // Ignore empty whitespace '#text' nodes
            if (node.nodeName !== "#text") {
                
                // CFI spec assigns even indices starting at 2
                // to XML child nodes and increments it by 2 for each child node
                // Ref: http://idpf.org/epub/linking/cfi/epub-cfi.html#sec-path-child-ref
                CFIRootEvenIndex += 2;
                
                if (node.nodeName === 'spine') {
                    spineNode = <HTMLElement> node;

                    rootSpineIndex = CFIRootEvenIndex;
                    break;
                }
            }
        }

        const spine = getXmlToJSON(spineNode.innerHTML) as ISpine;

        let itemRefEvenIndex = 0;

        let itemRefIndex = 0;

        for (const ref of spine.itemref) {
            itemRefEvenIndex += 2;

            if(ref['@_idref'] === idRef) {
                itemRefIndex = itemRefEvenIndex;
                break;
            }
        }

        return `/${rootSpineIndex}/${itemRefIndex}[${idRef}]!`;
    }

    function wrapCFIPath(CFIPath: string): string {
        return `epubcfi(${CFIPath})`;
    }
}
