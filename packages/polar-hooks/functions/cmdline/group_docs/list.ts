import {Groups} from "../../impl/groups/db/Groups";
import {GroupDocs} from "../../impl/groups/db/GroupDocs";
import {Stdout} from "../Stdout";
import {GroupArgs} from "../GroupArgs";


async function exec() {

    const groupRef = GroupArgs.handleArgsForGroupRef();

    const group = await Groups.getByRef(groupRef);

    if (! group) {
        throw new Error("No group for " + JSON.stringify(groupRef));
    }

    console.log("Fetching group docs for groupRef: ", groupRef);

    const records = await GroupDocs.listByGroupID(group.id);

    Stdout.report(records);

}

exec()
    .catch(err => console.error(err));
