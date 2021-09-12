import {ESDigester} from "./ESDigester";

async function exec(id: string) {
    console.log("Going to index id: " + id);
    const indexed = await ESDigester.doIndex(id)
    console.log("Document indexed: " + id);
}

// 13jtNBFMkD
const id = process.argv[2];

exec(id).catch(err => console.error(err));
