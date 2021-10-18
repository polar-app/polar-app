import { EPUBMetadataUsingNode } from './EPUBMetadataUsingNode';

type EPUBContentStream = {
    readonly id: string;
    readonly stream: NodeJS.ReadableStream;
};  
export namespace EPUBContent {
    export async function getStreams(filePath: string): Promise<EPUBContentStream[]> {
        const results: EPUBContentStream[] = [];
    
        const zip = EPUBMetadataUsingNode.getZip(filePath);

        try {
            const refs = await EPUBMetadataUsingNode.getChapterReferences(filePath);

            for (const ref of refs) {
                results.push({
                    id: ref.id,
                    stream: await zip.stream(ref.file)
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
}
