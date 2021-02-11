import {Stdout} from "../Stdout";
import {GroupDocAnnotations} from "../../impl/groups/db/doc_annotations/GroupDocAnnotations";

function getID() {
    // console.log(process.argv);
    return process.argv[2];
}

async function exec() {

    const id = getID();

    console.log("Fetching group_doc_annotation for id: ", id);

    const record = await GroupDocAnnotations.get(id);

    Stdout.report(record);

}

exec()
    .catch(err => console.error(err));
