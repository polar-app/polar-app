import {IProfile, ProfileIDStr} from "./Profiles";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";

export namespace BlockPermissionPage {

    export const COLLECTION = 'block_permission_page';

    export async function get(firestore: IFirestore<unknown>, id: ProfileIDStr): Promise<IProfile | undefined> {
        return await Collections.getByID(firestore, COLLECTION, id);
    }

}
