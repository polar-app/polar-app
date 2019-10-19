import yargs from "yargs";
import {Stderr} from "./Stderr";
import {GroupRef, Groups} from "../impl/groups/db/Groups";


export class GroupArgs {

    public static handleArgsForGroupRef(): GroupRef {

        const argv =
            yargs.describe('id', "Specify the group ID")
                .describe('name', "Name of the group")
                .argv;

        if (! argv.id && ! argv.name) {
            Stderr.die("Must specify either --id or --name.");
            throw new Error();
        }

        if (argv.id) {
            return {id: <string> argv.id};
        }

        if (argv.name) {
            return {name: <string> argv.name}
        }

        throw new Error("No id or name");

    }

}
