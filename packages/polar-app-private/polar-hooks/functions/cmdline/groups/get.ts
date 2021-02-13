import {Groups} from "../../impl/groups/db/Groups";
import {Stdout} from "../Stdout";

function getGroupName() {
    // console.log(process.argv);
    return process.argv[2];
}

async function exec() {

    const groupName = getGroupName();

    console.log("Fetching group metadata for group: ", groupName);

    const record = await Groups.getByName(groupName);

    Stdout.report(record);

}

exec()
    .catch(err => console.error(err));
