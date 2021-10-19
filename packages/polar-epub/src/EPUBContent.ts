import { EPUBMetadataUsingNode, IChapterReference } from './EPUBMetadataUsingNode';
import {JSDOM} from "jsdom"

interface IEPUBContent {
    /**
     * Chapter reference ID
     * e.g.: "titlepage"|"chapter_001"|etc..
     */
    readonly id: string;

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
    readonly CFI: string;

    /**
     * Parsed text
     * 
     */
    readonly text: string;
};
export namespace EPUBContent {
    export async function get(filePath: string): Promise<IEPUBContent[]> {
        const results: IEPUBContent[] = [];
    
        const zip = EPUBMetadataUsingNode.getZip(filePath);

        try {
            const refs = await EPUBMetadataUsingNode.getChapterReferences(filePath);

            for (const ref of refs) {
                results.push({
                    id: ref.id,
                    html: () => extractChapterHtml(filePath, ref)
                });
            }
        } catch(e) {
            console.error(e);

            throw new Error(`Failed to read EPUB content from the following path: ${filePath}`);
        } finally {
            await zip.close();
        }

        return results;
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
     * @param html html string being parsed
     * @param rootName epub document name e.g.:"alice.epub"
     * @returns IEPUBParagraph[] - array of objects
     */
    export function parseHtml(html: string): void {
        const dom = new JSDOM(html);

        dom.window.document.body.childNodes.forEach((node, index) => {
            parseChildren(node,`/${index}`);
        });

        // return dom.window.document.body.textContent ?? '';
    }

    export function parseChildren(node: ChildNode, nodePath = ""): IEPUBText|null{
        if (!node.hasChildNodes()) {

            // Ignore nodes with no text content
            if (node.textContent?.trim().length === 0) {
                return null;
            }

            const text = {
                CFI: wrapCFIPath(nodePath),
                text: <string>node.textContent
            };

            console.log(text);

            return text;
        }

        node.childNodes.forEach((node, index) => {
            parseChildren(node, `${nodePath}/${index}`);
        });

        return null;
    }


    function wrapCFIPath(CFIPath: string): string {
        return `epubcfi(${CFIPath})`;
    }
}
