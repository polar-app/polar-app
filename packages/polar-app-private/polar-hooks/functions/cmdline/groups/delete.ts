import {Groups} from "../../impl/groups/db/Groups";
import {Preconditions} from "polar-shared/src/Preconditions";
import {GroupDeletes} from "../../impl/groups/GroupDeletes";
import yargs from 'yargs';
import prompts from 'prompts';
import {GroupArgs} from "../GroupArgs";
import {Stderr} from "../Stderr";

async function exec() {

    const argv =
        yargs.describe('id', "Specify the group ID")
             .describe('name', "Name of the group")
        .argv;

    if (! argv.id && ! argv.name) {
        return Stderr.die("Must specify either --id or --name.")
    }

    const groupRef = GroupArgs.handleArgsForGroupRef();

    const group = await Groups.getByRef(groupRef);

    if (! group) {
        throw new Error("No group for " + JSON.stringify(groupRef));
    }

    console.log("Deleting group: ", JSON.stringify(group, null, "  "));

    const answers = await prompts({
        name: 'confirm',
        type: 'confirm',
        message: 'Are you sure you want to delete this group?',
    });

    if (! answers.confirm) {
        console.warn("Group not deleted.");
        return;
    }

    console.log("Deleting group...");

    await GroupDeletes.exec(group.id, undefined);

    console.log("Deleting group...done");

}

exec()
    .catch(err => console.error(err));

