import {Group} from "../../datastore/sharing/db/Groups";
import {GroupOption} from "./GroupsSelector";

export class GroupOptions {

    public static toGroupOptions(groups: ReadonlyArray<Group>): ReadonlyArray<GroupOption> {
        return groups.filter(group => group.visibility === 'public')
            .map(group => {
                return {
                    value: group.name!,
                    label: group.name!,
                };
            });

    }

}
