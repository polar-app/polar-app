import {ESAttachmentIndexer} from "./ESAttachmentIndexer";

async function exec(path: string) {
    console.log("Going to index path: " + path);
    const indexed = await ESAttachmentIndexer.doIndex({type: 'path', data: path})
    console.log("Document indexed: " + indexed.id);
}

const p = process.argv[2];

exec(p).catch(err => console.error(err));
