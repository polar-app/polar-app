import {Groups} from "../../impl/groups/db/Groups";
import {GroupDocs} from "../../impl/groups/db/GroupDocs";
import {GroupDocInfos} from "../../impl/groups/db/GroupDocInfos";
import {Stdout} from "../Stdout";

function getGroupID() {
    // console.log(process.argv);
    return process.argv[2];
}

async function exec() {

    const groupID = getGroupID();

    console.log("Fetching for groupID: ", groupID);

    const records = await GroupDocInfos.listByGroupID(groupID);

    Stdout.report(records);

}

exec()
    .catch(err => console.error(err));
