import { EPUBMetadataUsingNode } from './EPUBMetadataUsingNode';

export namespace EPUBContent {
    export async function getStreams(filePath: string) {
        const zip = EPUBMetadataUsingNode.getZip(filePath);
        const refs = await EPUBMetadataUsingNode.getChapterReferences(filePath);

        const results: NodeJS.ReadableStream[] = [];
    
        for (const ref of refs) {
            results.push(await zip.stream(ref.file));
        }

        await zip.close();
        
        return results;
    }
}
