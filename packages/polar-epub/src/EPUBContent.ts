import { EPUBMetadataUsingNode, IChapterReference } from './EPUBMetadataUsingNode';

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
}
