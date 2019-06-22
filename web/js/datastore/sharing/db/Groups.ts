import {Firestore} from '../../../firebase/Firestore';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';

export class Groups {

    public static readonly COLLECTION = 'group';

    public static async get(id: GroupIDStr): Promise<Group | undefined> {
        const firestore = await Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <Group> doc.data();
    }

}

export interface GroupInit {

    /**
     * When specified, use the given group name.
     */
    readonly name?: string;

    /**
     * Must set the group visibility here so that we inherit the right value.
     */
    readonly visibility: GroupVisibility;

    readonly tags?: ReadonlyArray<TagStr>;

}

export interface Group extends GroupInit {

    readonly id: GroupIDStr;
    readonly nrMembers: number;
    readonly created: ISODateTimeString;

}
export type GroupVisibility = 'private' | 'protected' | 'public';

export type TagStr = string;

