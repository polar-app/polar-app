/**
 * Allows us to return the group objects the user is a member of.
 */
import {Group, Groups} from "./Groups";
import {UserGroupCollection} from "./UserGroupCollection";

export class UserGroupMembership {

    public static async get(): Promise<ReadonlyArray<Group>> {

        const userGroup = await UserGroupCollection.get();

        if (! userGroup) {
            return [];
        }

        if (! userGroup.groups) {
            return [];
        }

        return await Groups.getAll(userGroup.groups);

    }

}

