import {GroupMemberInvitation} from "./db/GroupMemberInvitations";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLParams} from "../util/URLParams";

export class GroupJoins {

    public static createShareURL(invitation: GroupMemberInvitation): URLStr {
        const param = URLParams.encodeURIComponentAsJSON(invitation);
        return `https://app.getpolarized.io/apps/add-shared-doc?invitation=${param}`;
    }

}
