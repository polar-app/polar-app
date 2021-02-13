import {GroupNames} from "./GroupNames";

export class GroupSlugs {

    public static create(name: string) {
        // may not have a colon or forward slash like a tag ...
        GroupNames.assertValid(name);
        return name.toLowerCase();

    }

}
