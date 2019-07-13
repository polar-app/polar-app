import {Firestore} from '../../../firebase/Firestore';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {UserIDStr} from './Profiles';
import {Hashcodes} from '../../../Hashcodes';
import {PlainTextString, URLStr} from "../../../util/Strings";
import {ExternalLink} from "../rpc/GroupProvisions";
import {Clause, Collections, OrderByClause} from "./Collections";

const HASHCODE_LEN = 20;

export class Groups {

    public static readonly COLLECTION = 'group';

    public static createIDForKey(uid: UserIDStr, key: string) {
        return Hashcodes.createID({key, uid}, HASHCODE_LEN);
    }

    public static async get(id: GroupIDStr): Promise<Group | undefined> {
        const firestore = await Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <Group> doc.data();
    }

    public static async executeSearchWithTags(tags: ReadonlyArray<TagStr>): Promise<ReadonlyArray<Group>> {

        // INDEXES NEEDED
        //
        // visibility, lang, tags, nrMembers
        // visibility, tags, nrMembers

        // search by tag and by number of members descending

        // no paging yet.. just top groups to get this working and off the groupnd

        const visibilityClauses: ReadonlyArray<Clause> = [
            ['visibility', '==' , 'public']
        ];

        const tagClauses: ReadonlyArray<Clause>
            = tags.map(current => ['tags', 'array-contains', current]);

        const clauses: ReadonlyArray<Clause> = [...visibilityClauses, ...tagClauses];

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['nrMembers', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION,  clauses, {orderBy, limit});

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

    /**
     * A string (not HTML) that is used as a description for this document.
     */
    readonly description?: PlainTextString;

    readonly links?: ReadonlyArray<URLStr | ExternalLink>;

}

export interface Group extends GroupInit {

    readonly id: GroupIDStr;
    readonly nrMembers: number;
    readonly created: ISODateTimeString;

}
export type GroupVisibility = 'private' | 'protected' | 'public';

export type TagStr = string;

