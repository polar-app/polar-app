import {WriteBatch} from "@google-cloud/firestore";
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Firestore} from '../../util/Firestore';
import * as admin from 'firebase-admin';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import FieldValue = admin.firestore.FieldValue;
import {UserGroups} from './UserGroups';
import {UserIDStr} from './Profiles';
import {ISODateTimeStrings, ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {GroupSlugs} from './GroupSlugs';
import {IDUser} from '../../util/IDUsers';
import {GroupAdmins} from './GroupAdmins';
import UserRecord = admin.auth.UserRecord;
import {PlainTextStr, URLStr} from "polar-shared/src/util/Strings";
import {Clause, Collections} from "./Collections";
import {Arrays} from "polar-shared/src/util/Arrays";
import {FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";

const HASHCODE_LEN = 20;

export class Groups {

    public static readonly COLLECTION = 'group';

    public static createIDForKey(uid: UserIDStr, key: string) {
        return Hashcodes.createID({key, uid}, HASHCODE_LEN);
    }

    public static createID(idUser: IDUser, request: GroupIDRequest): GroupIDStr {

        const {uid} = idUser;

        if (request.key) {
            return this.createIDForKey(uid, request.key);
        }

        if (request.name) {
            // when the user uses a name we go ahead and provision the group
            // with that name.
            const slug = GroupSlugs.create(request.name);
            return Hashcodes.createID(slug, HASHCODE_LEN);
        }

        return Hashcodes.createRandomID(HASHCODE_LEN);

    }

    public static async getOrCreate(batch: WriteBatch, groupID: GroupIDStr, groupInit: GroupInit): Promise<Group> {

        Preconditions.assertPresent(groupInit.visibility, "visibility");

        const group = await this.get(groupID);

        if (group) {
            return group;
        }

        const firestore = Firestore.getInstance();

        const groupRef = firestore.collection(this.COLLECTION).doc(groupID);

        const created = ISODateTimeStrings.create();

        const newGroup: Group = {
            id: groupID,
            nrMembers: 0,
            created,
            ...groupInit
        };

        batch.create(groupRef, Dictionaries.onlyDefinedProperties(newGroup));

        return newGroup;

    }

    public static async get(id: GroupIDStr): Promise<Group | undefined> {
        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <Group> doc.data();
    }

    public static async getByName(name: string): Promise<Group | undefined> {

        // protected and private groups can not have names and these must be public.
        const clauses: ReadonlyArray<Clause> = [
            ['visibility', '==' , 'public'],
            ['name', '==', name]
        ];

        return Collections.getByFieldValues(this.COLLECTION, clauses);

    }

    public static async getByRef(groupRef: GroupRef): Promise<Group | undefined> {

        Preconditions.assertPresent(groupRef, "groupRef");

        if ((<any> groupRef)['name']) {
            const groupRefByName = <GroupRefByName> groupRef;
            return await this.getByName(groupRefByName.name);
        }

        if ((<any> groupRef)['id']) {
            const groupRefByID = <GroupRefByID> groupRef;
            return await this.get(groupRefByID.id);
        }

        throw new Error("Not a group ref: " + JSON.stringify(groupRef));

    }

    /**
     * Increment the count of the group members.
     */
    public static incrementNrMembers(batch: WriteBatch, groupID: GroupIDStr, delta: number = 1) {

        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(groupID);

        batch.update(ref, {
            nrMembers: FieldValue.increment(delta)
        });

    }

    public static markDeleted(batch: WriteBatch, groupID: GroupIDStr) {

        const firestore = Firestore.getInstance();
        const groupRef = firestore.collection(this.COLLECTION).doc(groupID);

        batch.update(groupRef, {deleted: true});

    }

    public static delete(batch: WriteBatch, groupID: GroupIDStr) {

        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(groupID);

        batch.delete(ref);

    }

    public static async verifyAccess(uid: UserIDStr,
                                     groupID: GroupIDStr): Promise<Group> {

        const group = await Groups.get(groupID);

        if (! group) {
            throw new Error("No group with group ID: " + groupID);
        }

        if (['protected', 'public'].includes(group.visibility)) {
            return group;
        }

        const userGroups = await UserGroups.get(uid);

        if (userGroups && Arrays.hasAny([groupID], Arrays.toArray(userGroups.groups))) {
            return group;
        }

        throw new Error("Invalid permissions to access document");

    }

    /**
     * Get the group and verify it's public before returning.  We give an id object
     * which represents the provider (which is just a key'd dictionary) and a
     * provider which returns a group.
     */
    public static async verifyPublic(id: {[key: string]: string},
                                     provider: () => Promise<Group | undefined>): Promise<Group> {

        const group = await provider();

        const describe = () => {
            return JSON.stringify(id);
        };

        if (! group) {
            throw new Error("No group for: " + describe());
        }

        if (group.visibility !== 'protected' && group.visibility !== 'public') {
            throw new Error("Group is not public or protected: " + describe());
        }

        return group;

    }

    public static async verifyAdmin(user: UserRecord, groupID: GroupIDStr) {

        const groupAdmin = await GroupAdmins.get(groupID);

        if (! groupAdmin) {
            throw new Error("Group with ID does not exist: " + groupID);
        }

        if (Arrays.toArray(groupAdmin.admins).includes(user.uid)) {
            return;
        }

        throw new Error("User is not an admin of this group.");

    }

    public static toGroupInit(group: Group): GroupInit {

        const result: any = group;

        delete result.id;
        delete result.nrMembers;
        delete result.created;

        return group;

    }

}

export interface GroupReq {
    readonly id?: GroupIDStr;
    readonly name?: GroupNameStr;
}

export interface GroupInit {

    /**
     * When specified, use the given group name.
     */
    readonly name?: string;

    /**
     * The primary lang for a group.
     */
    readonly lang?: Lang;

    /**
     * The set of languages that this group supports.  Most of the time a
     * group will have a primary language but if it's a language learning group
     * or a multi-lingual group it might have multiple languages.
     */
    readonly langs?: FirestoreTypedArray<Lang>;

    /**
     * Must set the group visibility here so that we inherit the right value.
     */
    readonly visibility: GroupVisibility;

    /**
     * A string (not HTML) that is used as a description for this document.
     */
    readonly description?: PlainTextStr;

    readonly links?: FirestoreTypedArray<URLStr | ExternalLink>;

    readonly tags?: FirestoreTypedArray<TagStr>;

}

export interface GroupIDRequest {

    /**
     * Use a user specific 'key' to compute a groupID rather than using a global
     * name.  They key could be anything as long as it's unique within the users
     * 'namespace'.  This can be used for computing a unique group for a users
     * document that they are sharing.
     */
    readonly key?: string;

    readonly name?: string;

}

export interface GroupIDRef extends GroupIDRequest {
    readonly id?: string;
}

export class GroupIDRefs {

    public static toID(idUser: IDUser, ref: GroupIDRef): GroupIDStr {

        if (ref.id) {
            return ref.id;
        }

        return Groups.createID(idUser, ref);

    }

}

export interface Group extends GroupInit {

    readonly id: GroupIDStr;
    readonly nrMembers: number;
    readonly created: ISODateTimeString;

}

export type GroupIDStr = string;

export type GroupVisibility = 'private' | 'protected' | 'public';

export type TagStr = string;

export interface ExternalLink {
    readonly name: PlainTextStr;
    readonly url: URLStr;
}

// TODO: add more language codes here
export type Lang = 'en' | 'es' | 'fr' | 'de';

export class GroupInits {
    public static equals(g0: GroupInit, g1: GroupInit) {
        return JSON.stringify(Dictionaries.sorted(g0)) === JSON.stringify(Dictionaries.sorted(g1));
    }
}

export interface GroupRefByName {
    readonly name: GroupNameStr;
}

export interface GroupRefByID {
    readonly id: GroupIDStr;
}

export type GroupRef = GroupRefByName | GroupRefByID;

export type GroupNameStr = string;
